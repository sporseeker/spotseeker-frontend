import { ContentAreaLayout } from "@/components/content-area-layout";
import React from "react";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <section className="mb-[100px] mt-[115px] lg:mb-[200px] lg:mt-[165px]">
      <ContentAreaLayout className="relative z-50 flex flex-col justify-center lg:mt-[-30px]">
        <h1 className="title">Privacy Policy - Copilot</h1>

        <div className="text-page">

          {/* 1. Introduction */}
          <div>
            <h2>1. Introduction</h2>
            <p>
              Spotseeker Copilot (“we”, “our”, or “the Application”) values the privacy of its users.
              This Privacy Policy explains how we collect, use, store, and protect data provided by Organizers using the Spotseeker Copilot application.
              By using the Application, you agree to the terms outlined in this Privacy Policy.
            </p>
          </div>

          <hr />

          {/* 2. Data Collected */}
          <div>
            <h2>2. Data Collected</h2>
            <p>
              Spotseeker Copilot collects only the information necessary to enable Organizers to manage and operate their events effectively.
              This may include:
            </p>

            <div className="pl-6">
              <ul className="list-disc">
                <li>Name, contact details, and business information of the Organizer</li>
                <li>Banking or payment account information for withdrawals and settlements</li>
                <li>Event details, schedules, pricing, and operational configurations</li>
                <li>Technical data related to Organizer device access, app usage, and system interactions</li>
              </ul>
            </div>

            <p className="mt-3">
              <strong>Note:</strong> Customer or attendee data is not accessible by Organizers and remains the exclusive property of Spotseeker.
            </p>
          </div>

          <hr />

          {/* 3. Use of Data */}
          <div>
            <h2>3. Use of Data</h2>
            <p>Data collected from Organizers is used exclusively to:</p>

            <div className="pl-6">
              <ul className="list-disc">
                <li>Provide, operate, and maintain the Spotseeker Copilot application</li>
                <li>Manage event operations, settlements, and withdrawals</li>
                <li>Monitor and improve platform performance</li>
                <li>Detect and prevent misuse or fraudulent activity</li>
                <li>Communicate with Organizers regarding account or application updates</li>
              </ul>
            </div>
          </div>

          <hr />

          {/* 4. Data Access */}
          <div>
            <h2>4. Data Access</h2>

            <div className="pl-6">
              <ul className="list-disc">
                <li>
                  Organizers have access only to their own account and event-related data entered into the Application.
                </li>
                <li>
                  Customer data, including ticket holders and personal information, is strictly controlled by Spotseeker and cannot be accessed, exported, or shared by Organizers.
                </li>
                <li>
                  Spotseeker staff may access event and account data for operational, security, and compliance purposes.
                </li>
              </ul>
            </div>
          </div>

          <hr />

          {/* 5. Data Security */}
          <div>
            <h2>5. Data Security</h2>
            <p>
              Spotseeker employs industry-standard security measures to protect Organizer data against unauthorized access, disclosure, or misuse. These measures include:
            </p>

            <div className="pl-6">
              <ul className="list-disc">
                <li>Secure data storage and encrypted transmissions</li>
                <li>Regular system monitoring and security audits</li>
                <li>Access control limited to authorized personnel only</li>
              </ul>
            </div>

            <p className="mt-3">
              Organizers are responsible for maintaining the confidentiality of their login credentials and must not share account access with unauthorized parties.
            </p>
          </div>

          <hr />

          {/* 7. Compliance */}
          <div>
            <h2>7. Compliance and Legal Requirements</h2>
            <p>
              Spotseeker Copilot complies with all applicable data protection laws. Organizers must also comply with relevant laws regarding their own business operations.
              Spotseeker may disclose Organizer data if required by law, legal process, or to protect the rights, safety, or property of Spotseeker or others.
            </p>
          </div>

          <hr />

          {/* 8. Changes */}
          <div>
            <h2>8. Changes to the Privacy Policy</h2>
            <p>
              Spotseeker Copilot reserves the right to update this Privacy Policy at any time.
              Organizers will be notified of material changes via the application or registered email.
              Continued use of the application constitutes acceptance of any updated policy.
            </p>
          </div>

          <hr />

          {/* 9. Deletion */}
          <div>
            <h2>9.⁠ ⁠Organizer Account Deletion Requests</h2>
            <p>
              Organizers registered on the Spotseeker Copilot application have the right to request 
              the deletion of their account and associated data. You may submit a direct deletion 
              request by clicking the following link: <Link href="/organizer-deletion" className="hover:opacity-75 transition-opacity font-bold">Request Organizer Account Deletion</Link>
            </p>
          </div>

        </div>
      </ContentAreaLayout>
    </section>
  );
};

export default PrivacyPolicy;
