import { ContentAreaLayout } from "@/components/content-area-layout";
import React from "react";
const TermsAndConditions = () => {
  return (
    <section className="mb-[100px] mt-[115px] lg:mb-[200px] lg:mt-[165px]">
      <ContentAreaLayout className="relative z-50 flex flex-col justify-center lg:mt-[-30px]">
        <h1 className="title">Terms & Conditions - Copilot</h1>
        <div className="text-page">
          <div>
            <h2>1. Use of the Application</h2>
            <p>
             Organizers agree to use Spotseeker Copilot solely for managing and operating their events. All information entered, including event details, schedules, pricing, and financial information, must be accurate, complete, and current at all times.
             Providing false, misleading, or incomplete information may result in suspension or termination of the Organizer’s account.
            </p>
          </div>
          <hr />
          <div>
            <h2>2. Account Management</h2>
            <p>
              Organizers are responsible for maintaining the security of their login credentials and access to the Spotseeker Copilot application.
              Sharing credentials or unauthorized access is strictly prohibited. Spotseeker is not liable for any loss or misuse arising from compromised accounts.
            </p>
          </div>
          <hr />
          <div>
            <h2>3. Event Management Responsibilities</h2>
            <p>
              Organizers are responsible for the creation, management, and execution of events using Spotseeker Copilot. This includes:
            </p>

            <div className="pl-6">
              <ul className="list-disc">
                <li>Uploading accurate event information</li>
                <li>Managing financial details, including ticket pricing and withdrawals</li>
                <li>Coordinating vendors and staff communication</li>
              </ul>
            </div>


            <p>
              Organizers must not use the application for unlawful, harmful, or fraudulent purposes.
            </p>
          </div>

          <hr/>
          <div>
            <h2>4. Payments and Withdrawals</h2>
            <p>
              Spotseeker Copilot provides tools to manage revenue, withdrawals, and settlements. Organizers agree to:
            </p>

            <div className="pl-6">
              <ul className="list-disc">
                <li>Provide accurate banking or payment information</li>
                <li>Monitor their account activity through the app</li>
              </ul>
            </div>

          </div>
          <hr/>
          <div>
            <h2>5. Intellectual Property</h2>
            <p>
              All content, software, and technology within Spotseeker Copilot are the intellectual property of Spotseeker and are protected by law. Organizers may only use these tools to operate events on the platform. Unauthorized copying, distribution, or commercial use of Spotseeker systems is prohibited.
            </p>
          </div>
          <hr />
          <div>
            <h2>6. Compliance and Legal Obligations</h2>
            <p>
              Organizers are responsible for complying with all applicable laws, regulations, and venue requirements when using the application.
              Spotseeker is not responsible for any legal issues, fines, or disputes arising from the Organizer’s events.
            </p>
          </div>
          <hr />
          <div>
            <h2>7. Termination and Suspension</h2>
            <p>
              Spotseeker reserves the right to suspend or terminate an Organizer’s account at its discretion for violations of these Terms, misuse of the application, or suspicious activity.
              Organizers may also close their accounts by following the procedures provided in the app.
            </p>
          </div>

        </div>
      </ContentAreaLayout>
    </section>
  );
};

export default TermsAndConditions;