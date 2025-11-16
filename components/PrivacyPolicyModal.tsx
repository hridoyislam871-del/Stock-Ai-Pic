import React from 'react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Privacy & Policy</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto pr-4 space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Terms for Free Credits (English)</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>
                Users receive 50 free credits upon signing up. Images generated using these free credits are subject to the following restrictions:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li><span className="font-semibold">Personal Use Only:</span> Images are for personal, non-commercial use only.</li>
                <li><span className="font-semibold">No Commercial Use:</span> You may not use these images in any commercial projects, advertising, or for any business purposes.</li>
                <li><span className="font-semibold">No Stock Uploads:</span> You are strictly prohibited from uploading, selling, or distributing these images on any stock photo websites or marketplaces (e.g., Adobe Stock, Shutterstock, etc.).</li>
                <li><span className="font-semibold">Copyright and Account Termination:</span> Violation of these terms constitutes copyright infringement. Your account will be permanently banned without warning if you are found to be using free-credit images for commercial purposes or on stock platforms.</li>
              </ul>
              <p>
                To use images commercially, please purchase a subscription plan. Images generated with purchased credits are not subject to these restrictions.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">ফ্রি ক্রেডিটের জন্য শর্তাবলী (বাংলা)</h3>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>
                সাইন আপ করার পরে ব্যবহারকারীরা ৫০টি ফ্রি ক্রেডিট পান। এই ফ্রি ক্রেডিট ব্যবহার করে তৈরি করা ছবিগুলির জন্য নিম্নলিখিত বিধিনিষেধ প্রযোজ্য:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li><span className="font-semibold">শুধুমাত্র ব্যক্তিগত ব্যবহার:</span> ছবিগুলি শুধুমাত্র ব্যক্তিগত, অ-বাণিজ্যিক ব্যবহারের জন্য।</li>
                <li><span className="font-semibold">কোনো বাণিজ্যিক ব্যবহার নয়:</span> আপনি এই ছবিগুলি কোনো বাণিজ্যিক প্রকল্প, বিজ্ঞাপন বা ব্যবসায়িক উদ্দেশ্যে ব্যবহার করতে পারবেন না।</li>
                <li><span className="font-semibold">স্টক ওয়েবসাইটে আপলোড নিষেধ:</span> আপনি কোনো স্টক ছবির ওয়েবসাইট বা মার্কেটপ্লেসে (যেমন: Adobe Stock, Shutterstock, ইত্যাদি) এই ছবিগুলি আপলোড, বিক্রয় বা বিতরণ করতে পারবেন না।</li>
                <li><span className="font-semibold">কপিরাইট এবং অ্যাকাউন্ট বাতিল:</span> এই শর্তাবলী লঙ্ঘন করলে তা কপিরাইট লঙ্ঘন হিসাবে বিবেচিত হবে। যদি দেখা যায় যে আপনি ফ্রি-ক্রেডিটের ছবি বাণিজ্যিক উদ্দেশ্যে বা স্টক প্ল্যাটফর্মে ব্যবহার করছেন, তাহলে আপনার অ্যাকাউন্ট কোনো সতর্কতা ছাড়াই স্থায়ীভাবে ব্যান করে দেওয়া হবে।</li>
              </ul>
              <p>
                বাণিজ্যিকভাবে ছবি ব্যবহার করার জন্য, অনুগ্রহ করে একটি সাবস্ক্রিপশন প্ল্যান কিনুন। কেনা ক্রেডিট দিয়ে তৈরি করা ছবিগুলির ক্ষেত্রে এই বিধিনিষেধ প্রযোজ্য নয়।
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;