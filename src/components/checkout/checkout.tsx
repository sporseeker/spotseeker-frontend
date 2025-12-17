"use client";
import { ContentAreaLayout } from "@/components/content-area-layout";
import ImageWrapper from "@/components/image-wrapper";
import { Button } from "@/components/ui/button";
import Sticky from "react-sticky-el";
import { Separator } from "@/components/ui/separator";
import {
  convertToLKR,
  formatDateTypeOne,
  submitForm,
  transformEventStates,
} from "@/lib/utils";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import AdditionalCheckout from "@/components/checkout/additional-checkout";
import CheckoutForm from "./checkout-form";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { CheckoutBar } from "../ui/checkout-bar";
import { Step } from "@/enum/step";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import http from "@/lib/http";
import { SingleCheckoutItem } from "./single-checkout-item";
import { updateAdditionCount } from "@/lib/store/slices/event-slice";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useSession } from "next-auth/react";
import { PromoCode } from "./promo-code";
import { PromoDetails, PromoError } from "@/types/promo";
import { IApiResponse } from "@/types/response";
import { toast } from "@/hooks/use-toast";
import {
  IKokoPaymentCreateRequest,
  IKokoPaymentCreateResponse,
  IPaymentCreateRequest,
  IPaymentCreateResponse,
} from "@/types/event/event-api";
import { AxiosError } from "axios";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PAYMENT_METHOD_ID, PaymentMethod } from "@/enum/event";
import { fbPixelEvent } from "@/lib/fbPixel";
import { gaEvent } from "@/lib/gAnalytics";

export const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "must be at least 2 characters.",
  }),
  phone: z.string().regex(/^(?:\+?[1-9]\d{1,14}|(?:0|94|\+94)?7[0-8]\d{7})$/, {
    message: "Phone number must be a valid global number or a Sri Lankan mobile number",
  }),
  nic: z.string().min(2, {
    message: "must be at least 2 characters.",
  }),
  paymentMethod: z.enum([PaymentMethod.CARD, PaymentMethod.KOKO], {
    errorMap: () => ({ message: "Payment method is required" }),
  }),
  agree: z.boolean().optional(),
  // agree: z.boolean().refine((value) => value === true, {
  //   message: "You must agree to continue.",
  // }),
  promoCode: z.string().optional(),
});

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

interface ICheckout {
  eventId: string;
}
const Checkout: FC<ICheckout> = ({ eventId }) => {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promo, setPromo] = useState<PromoDetails | null>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const ticketPackages = useAppSelector(
    (state: RootState) => state.event.ticketPackages,
  );

  const additions = useAppSelector((state: RootState) => state.event.additions);
  const event = useAppSelector((state: RootState) => state.event.event);

  useEffect(() => {
    if (event?.uid !== eventId) {
      router.push(`/event/${eventId}`);
    }
  }, [event, eventId, router]);

  useEffect(() => {
    if (typeof window === "undefined" || !event || !event.analytics) return;

    gaEvent("begin_checkout", {
      concert_id: event?.uid,
      concert_name: event?.name,
      ticket_package_details: ticketPackages
    });

    fbPixelEvent("InitiateCheckout", {
      concert_id: event?.uid,
      concert_name: event?.name,
      ticket_package_details: ticketPackages
    });
  }, [event]);

  const isMobile = useIsMobile();
  const subTotal = useMemo(() => {
    if (event) {
      const ticketTotal = ticketPackages.reduce((acc, v) => {
        return acc + parseFloat(v.price) * v.count;
      }, 0);
      const additionsTotal = additions.reduce((acc, v) => {
        return acc + parseFloat(v.price) * v.count;
      }, 0);
      return ticketTotal + additionsTotal;
    }
    return 0;
  }, [additions, event, ticketPackages]);

  const promoDetails = useMemo(() => {
    if (event) {
      const tp = ticketPackages.filter((tp) => tp.count > 0);
      if (tp.length === 1) {
        const filteredTp = event.ticket_packages.find((t) => t.id === tp[0].id);
        if (filteredTp) {
          return {
            promo: filteredTp?.promo,
            promoCode:
              filteredTp.promo && filteredTp?.promo_auto_apply
                ? filteredTp?.promo_code
                : null,
          };
        }
      }
    }
    return null;
  }, [event, ticketPackages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: session?.user?.first_name ?? "",
      lastName: session?.user?.last_name ?? "",
      email: session?.user?.email ?? "",
      phone: session?.user?.phone_no ?? "",
      nic: session?.user?.nic ?? "",
      promoCode:
        promoDetails?.promoCode && promoDetails.promo
          ? promoDetails?.promoCode
          : "",
      agree: false,
      paymentMethod: event?.payment_gateways?.every(
        (pg) => pg.id === PAYMENT_METHOD_ID[PaymentMethod.CARD],
      )
        ? PaymentMethod.CARD
        : undefined,
    },
  });

  const selectedPaymentMethod = form.watch("paymentMethod");

  const handlingCost = useMemo(() => {
    if (!event?.handling_cost) return 0;

    if (!selectedPaymentMethod) return 0;

    const selectedGateway = event.payment_gateways?.find(
      (pg) => pg.id === PAYMENT_METHOD_ID[selectedPaymentMethod],
    );

    if (!selectedGateway?.apply_handling_fee) return 0;

    if (event.handling_cost_perc) {
      return (subTotal * event.handling_cost) / 100;
    }

    return event.handling_cost;
  }, [event, subTotal, selectedPaymentMethod]);

  const promoDesc = useMemo(() => {
    if (promo?.disc_amt) {
      return promo?.disc_amt;
    }
    return 0;
  }, [promo?.disc_amt]);

  const paymentGatewayFee = useMemo(() => {
    if (!event?.payment_gateways || !selectedPaymentMethod) return 0;

    const selectedGateway = event.payment_gateways.find(
      (pg) => pg.id === PAYMENT_METHOD_ID[selectedPaymentMethod],
    );

    if (!selectedGateway || !selectedGateway.commission_rate) {
      return 0;
    }
    const baseAmount = subTotal + handlingCost - (promo?.disc_amt || 0);

    return (baseAmount * selectedGateway.commission_rate) / 100;
  }, [
    event?.payment_gateways,
    selectedPaymentMethod,
    subTotal,
    handlingCost,
    promo?.disc_amt,
  ]);

  const total = useMemo(
    () => subTotal + handlingCost + paymentGatewayFee - promoDesc,
    [subTotal, handlingCost, paymentGatewayFee, promoDesc],
  );

  const submitOrder = async (values: z.infer<typeof formSchema>) => {
    if (values.paymentMethod === PaymentMethod.KOKO) {
      await submitKokoOrder(values);
    } else {
      await submitCardOrder(values);
    }
  };

  const submitKokoOrder = async (values: z.infer<typeof formSchema>) => {
    try {
      const kokoPaymentData = await http.post<
        IKokoPaymentCreateRequest,
        { data: IKokoPaymentCreateResponse }
      >(`${window.location.origin}/api/payment/koko`, {
        event_id: event?.id,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone_no: values.phone,
        nic: values.nic,
        promo_code: values.promoCode,
        paymentGateway: event?.payment_gateways.find(
          (pg) => pg.id === PAYMENT_METHOD_ID[selectedPaymentMethod],
        ),
        ticket_package_details: ticketPackages
          .filter((tp) => tp.count > 0)
          .map((tp) => ({
            package_id: tp.id,
            ticket_count: tp.count,
            ...(tp.freeSeating ? {} : { seat_nos: [] }),
          })),
        addon_details: additions
          .filter((ad) => ad.count > 0)
          .map((ad) => ({
            addon_id: ad.id,
            quantity: ad.count,
          })),
        returnUrl: `${window.location.origin}/checkout/${event?.uid}/kokoSuccess`,
        cancelUrl: `${window.location.origin}/checkout/${event?.uid}/failure`,
        responseUrl: `${window.location.origin}/api/payment/koko/notify`,
      });

      submitForm(
        kokoPaymentData.data.paymentUrl,
        "POST",
        kokoPaymentData.data.data,
      );
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          (error as AxiosError<{ message: string }>).response?.data.message ??
          "There was an issue with the submitted data.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const submitCardOrder = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await http.post<
        IPaymentCreateRequest,
        { data: IPaymentCreateResponse }
      >(`${window.location.origin}/api/payment`, {
        event_id: event?.id,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone_no: values.phone,
        nic: values.nic,
        promo_code: values.promoCode,
        paymentGateway: event?.payment_gateways.find(
          (pg) => pg.id === PAYMENT_METHOD_ID[selectedPaymentMethod],
        ),
        ticket_package_details: ticketPackages
          .filter((tp) => tp.count > 0)
          .map((tp) => ({
            package_id: tp.id,
            ticket_count: tp.count,
            ...(tp.freeSeating ? {} : { seat_nos: [] }),
          })),
        addon_details: additions
          .filter((ad) => ad.count > 0)
          .map((ad) => ({
            addon_id: ad.id,
            quantity: ad.count,
          })),
      });

      const { order_id, hash, currency, total_amount } = response.data;
      submitForm(
        process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL
          ? process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL
          : "https://sandbox.payhere.lk/pay/checkout",
        "POST",
        {
          merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID ?? "",
          return_url: `${window.location.origin}/checkout/${event?.uid}/success`,
          cancel_url: `${window.location.origin}/checkout/${event?.uid}/failure`,
          notify_url: `${window.location.origin}/api/payment/notify`,
          order_id: order_id,
          items: event?.name ?? "Event Title",
          currency,
          amount: total_amount,
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone,
          hash,
          address: "-",
          city: "-",
          country: "-",
          ...transformEventStates(ticketPackages.filter((tp) => tp.count > 0)),
          custom_1: event?.uid ?? "",
          custom_2: (event?.id ?? "").toString(),
        },
      );
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          ((error as AxiosError).response?.data as { error: string }).error ??
          "There was an issue with the submitted data.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const promoCode = form.watch("promoCode");

  const fetchPromoData = async (
    promoCode: string,
    package_id: number,
    ticket_count: number,
    event_id: number,
  ) => {
    try {
      const data = await http.post<IApiResponse<PromoDetails, PromoError>>(
        "/api/promotions/check",
        {
          promo_code: promoCode,
          ticket_package_details: [
            {
              package_id,
              ticket_count,
            },
          ],
          email:
            status === "authenticated"
              ? session?.user?.email
              : form.getValues("email"),
          event_id,
        },
      );
      if (data.data.data) {
        setPromo(data.data.data);
      } else {
        setPromo(null);
      }
    } catch (error) {
      const errorMsg = (error as AxiosError<IApiResponse>)?.response?.data;
      const defaultError = errorMsg?.message
        ? errorMsg.message
        : "Invalid promo code";
      setPromo(null);
      form.setError("promoCode", {
        message:
          errorMsg?.errors && (errorMsg?.errors as PromoError).promoCode
            ? (errorMsg?.errors as PromoError).promoCode
            : defaultError,
      });
    }
  };
  const emailAddress = form.watch("email");
  useEffect(() => {
    if (event) {
      if (promoCode) {
        const tp = ticketPackages.find((tp) => tp.count > 0);
        if (tp) {
          if (validateEmail(emailAddress)) {
            fetchPromoData(promoCode, tp.id, tp.count, event.id);
          } else {
            setPromo(null);
          }
        }
      } else {
        setPromo(null);
      }
    }
  }, [promoCode, emailAddress]);

  // useEffect(() => {
  //   if (event) {
  //     if (promoCode && validateEmail(emailAddress)) {
  //       const tp = ticketPackages.find((tp) => tp.count > 0);
  //       if (tp) {
  //         fetchPromoData(promoCode, tp.id, tp.count, event.id);
  //       }
  //     }
  //   }
  // }, [emailAddress]);

  useEffect(() => {
    if (promoDetails?.promo && promoDetails.promoCode) {
      form.setValue("promoCode", promoDetails.promoCode);
    }
  }, [form, promoDetails?.promo, promoDetails?.promoCode]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        {event ? (
          <section className="checkout static mt-[80px] lg:mt-[120px] lg:pb-0">
            <ContentAreaLayout className="static flex-col pb-[100px]">
              <div className="bg-gradient-type-three-mobile lg:bg-gradient-type-three absolute z-[-1]"></div>
              <div className="grid h-full w-full grid-cols-1 pt-[24px] lg:grid-cols-[36%_1fr] lg:gap-x-[40px] lg:pt-[35px]">
                <div className="row-start-2 row-end-3 lg:col-start-1 lg:col-end-1 lg:row-start-1 lg:row-end-2">
                  <Sticky
                    boundaryElement=".checkout"
                    hideOnBoundaryHit={false}
                    stickyClassName="pt-[30px] pb-[100px]"
                    disabled={isMobile}
                    key="sticky-1"
                  >
                    <div className="relative overflow-hidden rounded-[15px] border border-[#ffffff]/10 pb-[52px] lg:sticky lg:top-0 lg:pb-[60px]">
                      <div className="bg-[linear-gradient(135deg,rgba(25,33,69,0.9)_50%,rgba(32,14,22,0.9)_100%)] p-[16px] pb-[25px] lg:p-[20px]">
                        <div className="mb-[24px] flex gap-x-[20px]">
                          <ImageWrapper
                            src={event.thumbnail_img}
                            className="h-[80px] w-[80px] min-w-[80px] flex-grow-0 overflow-hidden rounded-[8px]"
                            imageElementClassName="object-cover"
                            skeleton={false}
                          />
                          <div className="flex flex-col justify-center gap-y-[2px]">
                            <h3 className="line-clamp-1 text-16 font-semibold text-neutral-100 lg:text-18">
                              {event.name}
                            </h3>
                            <p className="text-14 text-grey-100/50">
                              {event.start_date
                                ? formatDateTypeOne(event?.start_date)
                                : ""}
                            </p>
                            <p className="line-clamp-1 text-14 text-grey-100/50">
                              {event.venue.name}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <p className="text-14 font-semibold text-grey-250">
                              Ticket
                            </p>
                            <Button
                              variant="link"
                              className="h-auto p-0 text-14 font-normal !text-primary-600"
                              onClick={() => router.push(`/event/${eventId}`)}
                            >
                              Edit
                            </Button>
                          </div>
                          <div className="flex flex-col gap-y-[20px] pt-[16px]">
                            {ticketPackages.map(
                              ({ count, name, price }, index) =>
                                count > 0 ? (
                                  <SingleCheckoutItem
                                    count={count}
                                    title={name}
                                    price={parseFloat(price)}
                                    key={index}
                                  />
                                ) : (
                                  false
                                ),
                            )}
                          </div>
                          <Separator className="my-[25px] !bg-white/20" />
                          {additions &&
                          additions.length > 0 &&
                          additions.some((a) => a.count > 0) ? (
                            <>
                              <p className="text-14 font-semibold text-grey-250">
                                Eats & Spirits
                              </p>
                              <div className="flex flex-col gap-y-[20px] pt-[16px]">
                                {additions
                                  .filter((a) => a.count > 0)
                                  .map(({ count, name, price, id }, index) => (
                                    <SingleCheckoutItem
                                      count={count}
                                      title={name}
                                      price={parseFloat(price)}
                                      key={index}
                                      onRemove={() => {
                                        dispatch(
                                          updateAdditionCount({ id, count: 0 }),
                                        );
                                      }}
                                    />
                                  ))}
                              </div>
                              <Separator className="my-[25px] !bg-white/20" />
                            </>
                          ) : (
                            ""
                          )}
                          <div className="flex flex-col gap-y-[20px]">
                            <div className="flex justify-between gap-x-[8px]">
                              <p className="flex items-center text-14 text-grey-250">
                                Sub Total
                              </p>
                              <p className="flex items-center text-14 text-grey-250">
                                {convertToLKR(subTotal)}
                              </p>
                            </div>
                            {handlingCost > 0 && selectedPaymentMethod && (
                              <div className="flex justify-between gap-x-[8px]">
                                <p className="flex items-center text-14 text-grey-250">
                                  Convenience Fee
                                  {`${event.handling_cost_perc ? `(${event.handling_cost}%)` : ""}`}
                                </p>
                                <p className="flex items-center text-14 text-grey-250">
                                  + {convertToLKR(handlingCost)}
                                </p>
                              </div>
                            )}
                            {/* {paymentGatewayFee > 0 && selectedPaymentMethod && (
                              <div className="flex justify-between gap-x-[8px]">
                                <p className="flex items-center text-14 text-grey-250">
                                  Payment Processing Fee
                                  {` (${event.payment_gateways.find((pg) => pg.id === PAYMENT_METHOD_ID[selectedPaymentMethod])?.commission_rate}%)`}
                                </p>
                                <p className="flex items-center text-14 text-grey-250">
                                  + {convertToLKR(paymentGatewayFee)}
                                </p>
                              </div>
                            )} */}
                            {promo ? (
                              <div className="flex justify-between gap-x-[8px]">
                                <p className="flex items-center text-14 text-grey-250">
                                  Promo Code Applied
                                </p>
                                <p className="flex items-center text-14 text-grey-250">
                                  - {convertToLKR(promo.disc_amt)}
                                </p>
                              </div>
                            ) : (
                              false
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 flex h-[52px] w-full items-center bg-primary-600 px-[16px] lg:h-[60px] lg:px-[20px]">
                        <p className="flex w-full justify-between font-semibold text-grey-100">
                          {selectedPaymentMethod === PaymentMethod.KOKO ? (
                            <>
                              <span className="uppercase">1st Installment</span>
                              <span>{convertToLKR(total / 3)}</span>
                            </>
                          ) : (
                            <>
                              <span>TOTAL</span>
                              <span>{convertToLKR(total)}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </Sticky>
                </div>
                <div className="row-start-1 row-end-2 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2">
                  <h1 className="pb-[16px] text-[20px] font-semibold text-grey-100 lg:pb-[20px] lg:text-[24px]">
                    Billing
                  </h1>
                  <div className="flex flex-col gap-y-[16px] pb-[16px] lg:pb-[50px]">
                    {event.addons_feature !== 0 && event.addons.length > 0 ? (
                      <AdditionalCheckout />
                    ) : (
                      <></>
                    )}
                    <CheckoutForm
                      isEditing={isEditing || status === "unauthenticated"}
                      setIsEditing={setIsEditing}
                    />
                    <div className="rounded-[12px] border border-grey-550 bg-grey-650 px-[20px] py-[24px] pb-[20px] lg:px-[28px] lg:pt-[24px]">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field: { value, onChange, disabled } }) => {
                          return (
                            <FormItem className="space-y-0">
                              <FormLabel className="flex pb-[16px] text-[16px] font-semibold text-white lg:text-20">
                                Payment Method
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={value}
                                  onValueChange={onChange}
                                  disabled={disabled}
                                  className="gap-0"
                                >
                                  {event.payment_gateways?.find(
                                    (pg) =>
                                      pg.id ===
                                      PAYMENT_METHOD_ID[PaymentMethod.CARD],
                                  ) && (
                                    <div className="flex items-center space-x-[16px] py-[20px]">
                                      <RadioGroupItem
                                        value={PaymentMethod.CARD}
                                        id="card"
                                      />
                                      <Label htmlFor="card">
                                        <div>
                                          <p className="pb-[8px] text-14 leading-[1] text-grey-300">
                                            Debit/Credit Cards, Just Pay
                                            Services, Wallets & Banking
                                          </p>
                                          <ImageWrapper
                                            src="/images/checkout/card-payment.png"
                                            className="flex h-[19px] w-[269px] justify-start lg:h-[23.4px] lg:w-[336px]"
                                            imageElementClassName="object-contain "
                                            skeleton={false}
                                          />
                                        </div>
                                      </Label>
                                    </div>
                                  )}

                                  {event.payment_gateways?.find(
                                    (pg) =>
                                      pg.id ===
                                      PAYMENT_METHOD_ID[PaymentMethod.KOKO],
                                  ) && (
                                    <div className="flex items-center space-x-[16px] border-t border-[#ffffff14] py-[20px]">
                                      <RadioGroupItem
                                        value={PaymentMethod.KOKO}
                                        id="koko"
                                      />
                                      <Label htmlFor="koko">
                                        <div>
                                          <ImageWrapper
                                            src="/images/checkout/koko.png"
                                            className="flex h-[22px] w-[46px] justify-start"
                                            imageElementClassName="object-contain "
                                            skeleton={false}
                                          />
                                          <p className="pt-[8px] text-14 leading-[1] text-grey-300">
                                            {`Pay in 3 installments${selectedPaymentMethod === PaymentMethod.KOKO ? ` of ${convertToLKR(total / 3)}` : ""}`}
                                          </p>
                                        </div>
                                      </Label>
                                    </div>
                                  )}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage className="max-w-[335px] text-14 text-primary-700" />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    {promoDetails?.promo ? (
                      <div className="rounded-[12px] border border-grey-550 bg-grey-650 px-[16px] py-[24px] pb-[28px] lg:px-[28px]">
                        <FormField
                          control={form.control}
                          name="promoCode"
                          render={({
                            field: { value, onChange, disabled },
                          }) => {
                            return (
                              <FormItem>
                                <FormLabel className="text-14 text-grey-300">
                                  Have a promo code?
                                </FormLabel>
                                <FormControl>
                                  <PromoCode
                                    onChange={(newPromoCode) => {
                                      if (newPromoCode === promoCode) {
                                        return;
                                      }
                                      if (!newPromoCode) {
                                        onChange("");
                                        return;
                                      }
                                      if (status === "authenticated") {
                                        onChange(newPromoCode);
                                      } else {
                                        form.trigger().then((valid) => {
                                          if (valid) {
                                            onChange(newPromoCode);
                                          } else {
                                            toast({
                                              title:
                                                "Incomplete Billing Information",
                                              description:
                                                "Please ensure your billing details are completed before applying the coupon code.",
                                              variant: "destructive",
                                            });
                                          }
                                        });
                                      }
                                    }}
                                    value={value}
                                    disabled={
                                      disabled || !validateEmail(emailAddress)
                                    }
                                  />
                                </FormControl>
                                {promo?.disc_amt && (
                                  <p className="!mt-0 text-14 text-[#26b060]">
                                    {`Promo code applied successfully, you are
                                    saving ${convertToLKR(promo.disc_amt)}`}
                                  </p>
                                )}
                                <FormMessage className="max-w-[335px] text-14 text-primary-700" />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    ) : (
                      false
                    )}
                  </div>
                </div>
              </div>
            </ContentAreaLayout>
            <CheckoutBar
              selectedPaymentMethod={selectedPaymentMethod}
              total={total}
              boundaryElement=".checkout"
              step={Step.CHECKOUT}
              onClick={async () => {
                if (form.formState.errors["promoCode"]) {
                  form.setValue("promoCode", undefined);
                }
                const isFormValid = await form.trigger();
                const isAgree = form.getValues("agree");
                const isVerified = session?.user?.verified;
                if (!isAgree) {
                  form.setError("agree", {
                    message: "You must agree to continue.",
                  });
                  toast({
                    description:
                      "You must agree to the terms and conditions before continuing.",
                    variant: "destructive",
                  });
                }
                if (status === "authenticated") {
                  if (!isVerified) {
                    form.setError("phone", {
                      message: "You must verify your phone before continuing.",
                    });
                    toast({
                      description:
                        "You must verify your phone before continuing.",
                      variant: "destructive",
                    });
                  }
                  if (isEditing) {
                    toast({
                      description:
                        "You must Save or discard changes before continuing.",
                      variant: "destructive",
                    });
                    return;
                  }
                  if (isFormValid && isAgree && isVerified) {
                    setIsLoading(true);
                    const values = form.getValues();
                    await submitOrder(values);
                    setIsLoading(false);
                  }
                } else {
                  if (isFormValid && isAgree) {
                    setIsLoading(true);
                    await submitOrder(form.getValues());
                    setIsLoading(false);
                  }
                }
              }}
              key="check-1"
              loading={form.formState.isSubmitting || isLoading}
            />
          </section>
        ) : (
          <ContentAreaLayout className="static h-full flex-col items-end">
            <div className="mb-[100px] mt-[80px] grid h-full w-full grid-cols-1 pt-[24px] lg:mt-[120px] lg:grid-cols-[36%_1fr] lg:gap-x-[40px] lg:pt-[35px]">
              <Skeleton className="h-[200px] w-full lg:h-[500px]" />
              <Skeleton className="h-[150px] w-full lg:h-[500px]" />
            </div>
          </ContentAreaLayout>
        )}
      </form>
    </FormProvider>
  );
};

export default Checkout;
