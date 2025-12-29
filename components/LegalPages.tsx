
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, children }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-32 animate-in fade-in duration-500">
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#237837]/20 to-transparent opacity-50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[#237837] font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-8 hover:-translate-x-1 transition-transform mx-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </button>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-4">
            {title}
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Effective Date: October 24, 2024</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-[48px] p-8 md:p-16 shadow-2xl border border-slate-100 prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-900">
          {children}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => (
  <LegalLayout title="Privacy Policy">
    <h2>1. Introduction</h2>
    <p>AutoSource ZW ("we", "us", or "our") operates the website autosource.co.zw. We are committed to protecting the privacy of our users in compliance with the <strong>Data Protection Act [Chapter 11:12]</strong> of Zimbabwe. This policy describes how we collect, process, and protect your personal information.</p>
    
    <h2>2. Information We Collect</h2>
    <h3>2.1 Personal Identification Information</h3>
    <p>We may collect personal information from Users in various ways, including, but not limited to, when Users visit our site, register on the site, place an order, list a vehicle, or subscribe to our newsletter. Users may be asked for:</p>
    <ul>
      <li>Full name and National ID details (for dealer verification).</li>
      <li>Email address and phone numbers.</li>
      <li>Physical business or residential addresses.</li>
      <li>Payment information (processed securely via third-party providers).</li>
    </ul>

    <h3>2.2 Vehicle Information</h3>
    <p>For sellers and dealers, we collect data regarding the vehicles listed, including VIN (Vehicle Identification Number), registration marks, engine numbers, and high-resolution imagery. This data is used to facilitate the marketplace and may be used for historical market analysis.</p>

    <h2>3. How We Use Collected Information</h2>
    <p>AutoSource ZW may collect and use Users' personal information for the following purposes:</p>
    <ul>
      <li><strong>To personalize user experience:</strong> We use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.</li>
      <li><strong>To improve our Site:</strong> We continually strive to improve our website offerings based on the information and feedback we receive from you.</li>
      <li><strong>To process transactions:</strong> Information provided when listing or buying is used only to provide service to that specific interaction.</li>
      <li><strong>To send periodic emails:</strong> The email address provided for order processing will only be used to send information and updates pertaining to their order or listing. It may also be used to respond to their inquiries, and/or other requests or questions.</li>
    </ul>

    <h2>4. Protection of Your Information</h2>
    <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site. Sensitive and private data exchange between the Site and its Users happens over a SSL secured communication channel.</p>

    <h2>5. Sharing Your Personal Information</h2>
    <p>We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners (such as Raytrents or insurance providers) for the purposes outlined above. We may disclose personal information if required to do so by law or in the good faith belief that such action is necessary to comply with legal mandates in Zimbabwe.</p>

    <h2>6. Changes to This Privacy Policy</h2>
    <p>AutoSource ZW has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the top of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect.</p>

    <h2>7. Contacting Us</h2>
    <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at <strong>legal@autosource.co.zw</strong>.</p>
  </LegalLayout>
);

export const TermsOfUsePage: React.FC = () => (
  <LegalLayout title="Terms of Use">
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing and using AutoSource ZW, you accept and agree to be bound by the terms and provision of this agreement. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
    
    <h2>2. Description of Service</h2>
    <p>AutoSource ZW is an online car marketplace and advertising platform. We facilitate the introduction of buyers to sellers. <strong>AutoSource ZW is not a motor dealer</strong> and does not take possession of, or legal title to, the vehicles listed on the platform (unless explicitly stated in a verified inventory). We are an intermediary service provider.</p>

    <h2>3. User Responsibilities</h2>
    <h3>3.1 Accuracy of Listings</h3>
    <p>Sellers are solely responsible for ensuring that the descriptions and specifications of the vehicles they list are accurate and not misleading. AutoSource ZW reserves the right to remove any listing that is found to be fraudulent or in violation of local laws.</p>
    
    <h3>3.2 Legal Ownership</h3>
    <p>By listing a vehicle, the seller represents and warrants that they are the legal owner of the vehicle or have the express legal authority to sell it on behalf of the owner, and that the vehicle is free of any undisclosed liens or encumbrances.</p>

    <h2>4. Limitation of Liability</h2>
    <p>AutoSource ZW and its components are offered for informational purposes only; this site shall not be responsible or liable for the accuracy, usefulness, or availability of any information transmitted or made available via the site, and shall not be responsible or liable for any error or omissions in that information.</p>
    <p><strong>Specifically, AutoSource ZW is not liable for:</strong></p>
    <ul>
      <li>Any mechanical failures of vehicles purchased through the platform.</li>
      <li>Disputes regarding payment between buyers and sellers.</li>
      <li>Loss of money due to fraudulent sellers or "ghost" listings.</li>
      <li>Inaccuracies in the AI-powered Valuation Tool.</li>
    </ul>

    <h2>5. Intellectual Property</h2>
    <p>The Site and its original content, features, and functionality are owned by AutoSource ZW and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>

    <h2>6. Termination</h2>
    <p>We may terminate your access to the Site, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account. All provisions of this Agreement that, by their nature, should survive termination shall survive termination.</p>

    <h2>7. Governing Law</h2>
    <p>This Agreement (and any further rules, polices, or guidelines incorporated by reference) shall be governed and construed in accordance with the laws of <strong>Zimbabwe</strong>, without giving effect to any principles of conflicts of law.</p>
  </LegalLayout>
);

export const CookiePolicyPage: React.FC = () => (
  <LegalLayout title="Cookie Policy">
    <h2>1. What Are Cookies?</h2>
    <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.</p>
    
    <h2>2. How We Use Cookies</h2>
    <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>

    <h2>3. The Cookies We Set</h2>
    <ul>
      <li><strong>Account related cookies:</strong> If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out.</li>
      <li><strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.</li>
      <li><strong>Newsletter related cookies:</strong> This site offers newsletter or email subscription services and cookies may be used to remember if you are already registered and whether to show certain notifications which might only be valid to subscribed/unsubscribed users.</li>
      <li><strong>Preferences cookies:</strong> In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it.</li>
    </ul>

    <h2>4. Third Party Cookies</h2>
    <p>In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
    <ul>
      <li><strong>Google Analytics:</strong> This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit.</li>
      <li><strong>Social Media Buttons:</strong> We also use social media buttons and/or plugins on this site that allow you to connect with your social network in various ways. For these to work the following social media sites including; Facebook, Instagram, and LinkedIn, will set cookies through our site which may be used to enhance your profile on their site or contribute to the data they hold for various purposes outlined in their respective privacy policies.</li>
    </ul>

    <h2>5. Disabling Cookies</h2>
    <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site.</p>

    <h2>6. More Information</h2>
    <p>Hopefully, that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.</p>
    <p>For more information, feel free to contact us: <strong>support@autosource.co.zw</strong></p>
  </LegalLayout>
);
