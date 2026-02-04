import React from "react";
import heroImage from "../assets/Policy/Refund.png";
export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen"  id="no-copy">
      {/* Banner */}
      <section className=" mt-10">
        <div className="w-full">
          
           <img  src={heroImage} alt="Scopik VR"  className="w-[100%] h-full object-cover object-top" />
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 w-full px-6 py-12 bg-white text-gray-800 leading-relaxed dark:bg-black dark:text-white">
  <article className="max-w-4xl mx-auto">
    <h2
      className="text-xl font-bold mb-4 dark:text-orange-400"
      style={{ fontFamily: "Newsreader, sans-serif" }}
    >
           Private Class:
          </h2>
         <ol>
            <li>Students can cancel/reschedule any class, 2 hours before class start time. While rescheduling, you can either reschedule the class to any available slot within next 7 days or shift the class towards the end of your classes (Your classes will be extended by one more class).</li>
            <li>Any course cancellation within 4 hours of the purchase window will lead to a 100% refund. In case the cancellation happens after 4 hours of the purchase window it will lead to penalty of 50% of course amount. On cancellation, 50% of booked amount of the cancelled class will be added back to the wallet within next 7 working days.</li>
            <li>Students can apply for a transfer, and we would be happy to find another program for you and 10% processing charge will be added as a procedure.</li> 
         </ol>
         {/* </div> */}
         <div>
             <h2
            className="text-xl font-bold mb-4 mt-5 dark:text-orange-400"
            style={{ fontFamily: "Newsreader, sans-serif" }}
          >
           Group Class:
          </h2>
         <ol>
            <li>Students can cancel/reschedule any class 4 hours before class start time. While rescheduling, you can reschedule class towards the end of your classes (Your classes will be extended by one more class). Upon cancellation acceptance, 100% of the booking amount will be added back to the wallet within 7 working days.</li>
            <li>Any course cancellation within 4 hours of the purchase window will lead to a 100% refund. In case the cancellation happens after 4 hours of the purchase window it will lead to penalty of 50% of course amount. On cancellation, 50% of booked amount of the cancelled class will be added back to the wallet within next 7 working days.</li>
            <li>On courses lasting more than 30 days, Students can request for pro-rated refund within 30 days of payments. If the request is raised, 18% GST (Taxes) and 10% processing charge will be deducted from the refund amount.</li>
            <li>Post 30 days, there is no refund for group classes. Students can move to another available batch or another course. Please note, Scopik LMS will put best effort to address any scheduling or teachers' related concern and provide best possible solution.</li>
         </ol>

         </div>
        </article>
      </main>
    </div>
  );
}
