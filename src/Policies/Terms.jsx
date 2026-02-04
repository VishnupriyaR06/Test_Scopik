import { useState } from "react";
import heroImage from "../assets/Policy/Terms.png";

export default function TermsAndConditions() {
  const [darkMode, setDarkMode] = useState(false);

 return (
  <div className={darkMode ? "dark" : ""} id="no-copy">
    <div className="flex flex-col min-h-screen bg-white dark:bg-black dark:text-gray-100">
      {/* Banner */}
      <section className="mt-10">
        <div className="w-full">
          <img
            src={heroImage}
            alt="Scopik VR"
            className="w-screen  object-cover object-top"
          />
        </div>
      </section>

        {/* Content */}
        <main className="flex-1 w-full px-6 py-12 bg-white text-gray-800 leading-relaxed dark:bg-black dark:text-white">
  <article className="max-w-4xl mx-auto">
    <h2
      className="text-xl font-bold mb-4 dark:text-orange-400"
      style={{ fontFamily: "Newsreader, sans-serif" }}
    >
                Terms of Use
              </h2>
              <p>
                These Terms of Access ("Terms") describe the policies and
                procedures governing your use of Scopik LMS' website
                (https://lms.scopik.in), apps, and other products and services
                ("Services") (collectively, "Scopik LMS", a private company
                established under the laws of India having its Corporate Office
                at No: 4071/8, S1, 2nd Floor, Srinivasa Nagar, 3rd Cross Street,
                Ramnager North Extension, Madipakkam, Chennai-600 091, Tamil
                Nadu. As some of our Services may be software that is downloaded
                to your computer, phone, tablet, or other devices, you agree
                that we may automatically update this software and that these
                Terms will apply to such updates.
              </p>
              <p>
                We suggest you read these Terms carefully and contact us at{" "}
                <a
                  href="mailto:support@scopik.in"
                  className="text-indigo-600 dark:text-indigo-400 underline"
                >
                  support@scopik.in
                </a>{" "}
                in case of any queries. By using our Services, you agree to be
                bound by these Terms as well as the policies referenced in these
                Terms.
              </p>
            {/* </section> */}

            <section>
              <h2
                className="text-2xl font-bold mb-4 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
                Who May Use Our Services
              </h2>
              <p>
                You may use our Services only if you can form a binding contract
                with Scopik LMS, and only in compliance with these Terms and all
                applicable laws. When you create your Scopik LMS account, and
                subsequently when you use our Services, you must provide us with
                accurate and complete information, and you agree to update your
                information to keep it accurate and complete.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-bold mb-4 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
                License Provided to You
              </h2>
              <p>
                Subject to these Terms and our policies (including the Copyright
                and Trademark Policy, and course specific eligibility
                requirements, and other terms), we grant you a limited,
                personal, non-exclusive, non-transferable, and revocable license
                to use our Services. You may download content from Scopik LMS
                Platform only for your personal, non-commercial use. Please note
                that the content available on Scopik LMS Platform should not be
                downloaded or used for any other purposes.
              </p>
              <p>
                You also agree that you will create, access, and/or use only one
                user account unless expressly permitted by us, and you will not
                share with any third party, access to your account. Please note
                that our Services do not give you ownership of any intellectual
                property rights in our Services or the content you access on
                Scopik LMS Platform.
              </p>


 <h2
                className="text-2xl font-bold mb-4 mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
               Content Offerings
              </h2>
              <p><b>Changes to Content Offerings –</b> Scopik LMS offer courses and content ("Content Offerings") from content providers ("Content Providers"). While we seek to provide quality Content Offerings from our Content Providers, unexpected events may happen. Scopik LMS reserves the right to cancel, interrupt, reschedule, or modify any Content Offerings. Content Offerings are subject to the Disclaimers and Limitation of Liability sections mentioned below. Scopik LMS' Content Providers have no obligation to have Content Offerings recognized by or affiliated to any educational institution or accreditation organization.</p>
     <div>
      <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
               Your Content
              </h2>

              <p><b> User Content –</b> Scopik LMS Platform enables you to share your content, such as projects, assignments you submit, posts you make in the forums, and the like ("User Content"), with Scopik LMS, the Content Providers, and/or other users. User Content does not include the Content Offerings or any other material made available on or placed on to the Scopik LMS Platform by Scopik LMS' Content Providers. Such Content Offerings are governed by the relevant agreements signed between Scopik LMS and its Content Providers.</p>
             <p><b> How Scopik LMS and Others May Use User Content – </b> To the extent that you provide User Content, Scopik LMS shall have a fully-transferable, perpetual, sub-licensable, exclusive, worldwide license to copy, distribute, modify, create derivative works based on, publicly perform, publicly display, and otherwise use the User Content. (Please refer to the Copyright and Trademark Policy) Scopik LMS shall also have the right to authorize Content Providers to use User Content, included but not limited to video recordings of meeting sessions, assignments, with their students registered on Scopik LMS Platform. Nothing in these Terms shall restrict other legal rights Scopik LMS may have to User Content, for example under other licenses.
    <p>We reserve the right to remove or modify User Content for any reason including but not limited to User Content that we believe violates these Terms.</p></p>
</div> 
<div>
   <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
              Feedback
              </h2>
              <p>We welcome your suggestions, comments and other feedback regarding the Services ("Feedback"). By submitting any Feedback, you grant us the right to use the Feedback without any restriction or giving any compensation to you. By accepting your Feedback, Scopik LMS does not waive any rights to use similar or related Feedback previously known to Scopik LMS, developed by us, or obtained from other sources. In our strive for constant improvement of our Services, we may contact you to further discuss the Feedback provided by you.</p>
</div>
<div>
    <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
            Security
              </h2>
              <p>While we work to protect the security of your account and related information, Scopik LMS cannot guarantee that unauthorized third parties will not be able to breach our security measures. Please notify us immediately of any compromise or unauthorized use of your account, on support@Scopik.in.</p>
</div>
<div>
   <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
            Third-Party Content
              </h2>
              <p>Through the Services, you will have the ability to access and/or use content provided by Content Providers, other users, and/or other third parties and links to websites and services maintained by third parties. Scopik LMS cannot guarantee that such third-party content, in the Services or elsewhere, will be free of material you may find objectionable/inappropriate or of malware that may harm your computer, mobile device, or any files therein. Scopik LMS disclaims any responsibility or liability related to your access or use of, or inability to access and use, such third-party content.</p>
</div>
<div>
     <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
           Copyright and Trademark Policy
              </h2>
              <p>We respect the intellectual property rights of our users, Content Providers, and other third parties and expect our users to do the same when using the Services. We have adopted and implemented the Scopik LMS' Copyright and Trademark Policy in accordance with applicable law.</p>
</div>
<div>
     <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
         Video Recordings
              </h2>
              <p>The video recordings of your participation in sessions may be used for the purpose of research or marketing. Please refer to our Privacy Policy for further details on our use of the video recordings on sessions.</p>
</div>
<div>
     <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
        Payment of Fees
              </h2>
              <p>You are responsible for paying all fees charged by Scopik LMS and applicable taxes in a timely manner with a payment mechanism specified with the said Service. If your payment method fails or your account is past due, we may collect fees using other collection mechanisms. Fees may vary based on your location and other factors, and we reserve the right to change any fees at any time at its sole discretion. Any change, update, or modification will be effective immediately upon posting through the relevant Services. Refunds may be available for paid Services as described in our Refund and Cancellation Policy.</p>
</div>
<div>
     <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
        Modifying and Terminating our Services
              </h2>
              <p>We constantly strive to improve our Services. We may add or remove certain functions, features, or requirements, and we may suspend or stop part of our Services altogether. If your use of a Service is terminated, a refund may be available as specified in our Refund and Cancellation Policy. Please note that we may not be able to deliver some or all of the Services to certain regions or countries for various reasons, including due to internet access limitations and government restrictions, and Scopik LMS, it's Content Providers, its contributors, sponsors, and other business partners, and their employees, contractors, and other agents (the "Associated Parties") shall not be liable to you for the same.</p>
</div>
<div>
     <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
       Disclaimers
              </h2>
              <p>The Services and the content available on the Scopik LMS Platform are provided on an "as is" basis without warranty of any kind, whether express or implied. Scopik LMS and the Associated Parties specifically disclaim any and all warranties and conditions of merchantability, fitness for a particular purpose, and any warranties arising out of course of dealing or usage of trade. Scopik LMS and the Associated Parties further disclaim any and all liability related to your access or use of the services or any related content. You acknowledge and agree that any access to or use of the services or such content is at your own risk.</p>
</div>
<div>
     <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
       Limitation of Liability
              </h2>
              <p>To the maximum extent permitted by law, Scopik LMS and the Associated Parties shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:</p>
              <ol type="1">
                <li>your access to or use of or inability to access or use the Services;</li>
                <li>any conduct or content of any party other than Scopik LMS and the applicable Associated Party, including without limitation, any defamatory, offensive, or illegal conduct; or</li>
                <li>unauthorized access, use, or alteration of your content or information. In no event shall Scopik LMS’ aggregate liability for all claims related to the Services exceed INR 500 (Indian Rupees Five Hundred) or the total amount of fees received by Scopik LMS from you for the use of the particular Service that is the subject of the claim, whichever is greater.</li>
              </ol>
              <p>You acknowledge and agree that the disclaimers and the limitations of liability set forth in these Terms reflect a reasonable and fair allocation of risk between you and Scopik LMS and the Associated Parties and that these limitations are an essential basis to Scopik LMS’ ability to make the Services available to you on an economically feasible basis.</p>
              <p>You agree that any cause of action related to the Services shall be permanently barred unless it commences within one (1) year after the cause of action accrues.</p>
</div>
<div>
  <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
      Indemnification
              </h2>
              <p>You agree to indemnify, defend, and hold harmless the Scopik LMS and the Associated Parties from any and all claims, liabilities, expenses, and damages, including reasonable attorneys' fees and costs, made by any third party related to:</p>
<ol type="1">
  <li>your use or attempted use of the Services in violation of these Terms;</li>
  <li>your violation of any law or rights of any third party; or</li>
  <li>User Content, including without limitation any claim of infringement or misappropriation of intellectual property or other proprietary rights.</li>
</ol>
</div>
<div>
  <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
     Governing Law and Jurisdiction
              </h2>
 <p>You agree that any dispute related to these Terms shall be governed by and construed in accordance with the laws of India. You further irrevocably and unconditionally submit to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.</p>
 <p>In case of any dispute, difference, controversy or claim arising between you and Scopik LMS &/or the Associated Parties arising out of the violation of or with respect to these Terms, every such dispute and matter shall be referred to a sole arbitrator mutually appointed by you and Scopik LMS in accordance with the provisions of the Arbitration & Conciliation Act, 1996 or subsequent enactment or amendment thereto. The seat of Arbitration shall be at Chennai, Tamil Nadu. The language of the arbitration shall be English. The cost of arbitration shall be borne equally by you and Scopik LMS &/or the Associated Parties. The award of the arbitrator shall be final and conclusive and binding upon you and Scopik LMS & the Associated Parties.</p>
</div>
<div>
    <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
   Revisions to the Terms
              </h2>
              <p>We reserve the right to revise these Terms at our sole discretion at any time. Any revisions to the Terms will be effective immediately upon posting by us. For any material changes to the Terms, we will take reasonable steps to notify you of such changes. In all cases, your continued use of the Services after publication of such changes, with or without notification, shall constitute binding acceptance of the revised Terms.</p>
</div>
<div>
   <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >
  Severability
              </h2>
              <p>If any provision of these Terms is held to be illegal, invalid or unenforceable under any law from time to time:</p>
<ol>
  <li>such provision shall be fully severable;</li>
  <li>the Terms shall be construed and enforced as if such illegal, invalid or unenforceable provision had never comprised a part hereof; and</li>
  <li>the remaining provisions of this Agreement shall remain in full force and effect and shall not be affected by the illegal, invalid or unenforceable provision or by its severance.</li>
</ol>
</div>

<div>
   <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              > Waiver          
    </h2>
    <p>No waiver or no instance of not taking an immediate action of any breach of any provision of these Terms shall constitute a waiver of any prior, concurrent or subsequent breach of the same or any other provisions.</p>
</div>
<div>
   <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              > Content Providers        
    </h2>
    <p>Scopik LMS’ Content Providers are third party beneficiaries of the Terms and may enforce those provisions of the Terms that relate to them.</p>
</div>
<div>
   <h2 className="text-2xl font-bold mb-4  mt-5 text-gray-900 dark:text-orange-400"
                style={{ fontFamily: "Newsreader, sans-serif" }}
              >COPYRIGHT AND TRADEMARK POLICY       
    </h2>
    <p>Scopik LMS respects the intellectual property rights of our Content Providers and other third parties and expects our users to do the same when using the Services. We reserve the right to suspend, disable, or terminate the accounts of users who repeatedly infringe or are repeatedly charged with infringing the copyrights, trademarks, or other intellectual property rights of others. If you believe in good faith that materials provided in the course of rendering the Services infringe your copyright, you may send us a notice requesting that the material be removed or access to it blocked.</p>
<p>Scopik LMS shall own the right, title and interest in and to all reviews, Feedback and other User Content posted by you with respect to the Services, and all derivative works based upon the said content. To the extent applicable, Scopik LMS shall be deemed to be the “author” of all such derivative works, under Section 17(c) of the Indian Copyright Act, 1957 and any other applicable copyright law. Please note that by accepting these terms, you waive any and all moral rights in and to such derivative works, and assign to Scopik LMS all rights, title and interest that you may have or may hereafter acquire in all such derivative works, including all intellectual property rights therein. At Scopik LMS’ expense, you shall execute all documents and take all actions necessary for Scopik LMS to document, obtain, maintain or assign its rights to such derivative works. All such materials will be deemed to be the confidential, proprietary and trade secret information of Scopik LMS.</p>
<p>Scopik LMS also respects the trademark rights of others. If any accounts on Scopik LMS Platforms are found to share any content that misleads others or violates another’s trademark may be updated, suspended, disabled, or terminated by Scopik LMS, at its sole discretion. If you are concerned that someone may be using your or any other trademark in an infringing way on Scopik LMS Platform, please email us at support@Scopik.in, and we will review your complaint. Upon such review, we may remove the offending content, warn the individual who posted the content, and/or temporarily or permanently suspend or disable the individual’s account, at our sole discretion.</p>
</div>
            </section>
          </article>
        </main>
      </div>
    </div>
  );
}

