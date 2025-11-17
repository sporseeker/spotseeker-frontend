import { ContentAreaLayout } from "@/components/content-area-layout";
import React from "react";
const PrivacyPolicyPage = () => {
  return (
    <section className="mb-[100px] mt-[115px] lg:mb-[200px] lg:mt-[165px]">
      <ContentAreaLayout className="relative z-50 flex flex-col justify-center lg:mt-[-30px]">
        <h1 className="title">Privacy Policy - Spotseeker</h1>
        <div className="text-page">
          <div>
            <p>
              Spotseeker.lk (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
              is committed to protecting the privacy of our users
              (&quot;you,&quot; &quot;your,&quot; or &quot;users&quot;). This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website
              [www.spotseeker.lk], use our services, or engage with us in any
              other way. By using our website or services, you agree to the
              collection and use of information in accordance with this policy.
            </p>
            <p>
              You can visit our Website (www.spotseeker.lk) and browse without
              having to provide personal details. During your visit to the
              Website, you remain anonymous and at no time can we identify you
              unless you have an account on the Website and log on with your
              username and password.
            </p>
            <p>
              If you have any suggestions or complaints you may contact us at
              (hello@spotseeker.lk)
            </p>
          </div>
          <hr />
          <div>
            <h2>Information We Collect</h2>
            <h3 className="heading-3">Personal Data</h3>
            <p>
              When you use our services, we may ask you to provide personal
              information that can be used to contact or identify you and to
              provide you with our services.
            </p>
            <ul>
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Contact Number</li>
              <li>NIC/Driving License/Passport Number</li>
            </ul>
            <p>
              You must only submit accurate and truthful information to us, and
              you are responsible for keeping it up to date.
            </p>
            <p>
              We reserve the right to request documentation to verify the
              information you have provided.
            </p>
            <p>
              We will only collect your personal information if you voluntarily
              provide it to us. If you choose not to provide your personal
              information or later withdraw your consent, we may be unable to
              offer our services to you.
            </p>
            <p>
              You may access and update your personal information submitted to
              us at any time.
            </p>
            <p>
              If you provide us with personal information of a third party, we
              assume that you have obtained the necessary consent from that
              party to share and transfer their personal information to us.
            </p>
          </div>
          <hr />
          <div>
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect for a variety of purposes,
              including:
            </p>
            <ul>
              <li>To provide and maintain our services</li>
              <li>To process transactions and manage event bookings</li>
              <li>
                To communicate with you about updates, promotions, and events
              </li>
              <li>
                To improve and customize your user experience on our platform
              </li>
              <li>To analyze website usage and enhance our services</li>
            </ul>
          </div>
          <hr />
          <div>
            <h2>Sharing & Disclosure of Personal Information</h2>
            <p>
              <span>Service Providers:</span> We may share your information with
              third-party service providers who help us operate our website and
              provide services (e.g., payment processors, email delivery
              services).
            </p>
            <p>
              <span>Legal Obligations:</span> We may disclose your information
              if required by law or in response to valid requests by public
              authorities (e.g., courts, law enforcement agencies).
            </p>
            <p>
              When sharing your personal information with third parties and our
              affiliates, we strive to ensure they protect it from unauthorized
              access, collection, use, disclosure, or other risks. Additionally,
              they will retain your personal information only for as long as
              necessary to fulfill the stated purposes.
            </p>
            <p>
              Spotseeker does not engage in the sale of customers&apos; personal
              information to third parties for any reason. We are committed to
              protecting your privacy and ensuring that your personal data is
              only used for the purposes outlined in this policy, such as
              providing our services, improving your experience, or complying
              with legal obligations. We do not profit from sharing your
              personal information and will only share it with third parties
              when necessary, As mentioned Above.
            </p>
            <p>
              <span>
                All credit and debit card details, will not be stored, sold,
                shared, rented, or leased to any third parties under any
                circumstances.
              </span>{" "}
              This information is collected solely for the purpose of processing
              payments and providing our services. Spotseeker is committed to
              safeguarding your financial and personal data, ensuring it is used
              strictly in accordance with this policy, and protected from
              unauthorized access or misuse.
            </p>
          </div>
          <hr />
          <div>
            <h2>Changes to the Privacy and Data Usage Policy</h2>
            <p>
              Spotseeker will regularly review and assess the adequacy of this
              Privacy Policy. We reserve the right to modify or update the
              policy at any time. Any changes will be published on our website,
              with the policy clearly marked as &quot;last updated&quot; along
              with the corresponding date to reflect the most recent revisions.
            </p>
          </div>
          <hr />
          <div>
            <h2>Spotseeker&apos;s Right</h2>
            <p>
              You acknowledge and agree that Spotseeker reserves the right to
              disclose your personal information to legal, regulatory,
              governmental, tax, law enforcement, or other authorities, as well
              as relevant rights holders, if we have reasonable grounds to
              believe such disclosure is necessary. This may occur in response
              to an order, investigation, or request by these parties to meet
              obligations or requirements, whether voluntary or mandatory. To
              the extent permitted by applicable law, you agree not to pursue
              any legal action or claims against Spotseeker for the disclosure
              of your personal information in these circumstances.
            </p>
          </div>
          <hr />
          <div>
            <h2>Contacting Spotseeker</h2>
            <p>
              If you wish to withdraw your consent for our use of your personal
              information, request access to or correction of your personal
              data, or if you have any questions, comments, or concerns, please
              feel free to contact us. You can reach us at
              hello@spotseeker.lk for assistance with any technical matters
              or inquiries.
            </p>
          </div>
          <hr />
          <div>
            <h2>User Data Deletion Request</h2>
            <p>
              At Spotseeker.lk, we respect your privacy and your right to manage
              your data. If you wish to delete your account and associated
              personal data, please email us at [hello@spotseeker.lk] with
              the subject &quot;Data Deletion Request&quot; and include your
              registered email & phone number.
              <br /> Our team will process your request within 2 to 3 business
              days, and you will receive a confirmation once the deletion is
              complete.
            </p>
          </div>
        </div>
      </ContentAreaLayout>
    </section>
  );
};

export default PrivacyPolicyPage;
