import { h } from 'preact';
import Layout from '../components/Layout';
import { i18n } from '@lingui/core';

export default () => {
    return (
        <Layout>
            <main className="container px-6 py-6 mx-auto flex-grow flex flex-col overflow-auto no-scrollbar">
                <h1 className="text-4xl mb-6">{i18n.t('Privacy Policy')}</h1>
                <ol className="flex flex-col gap-6">
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('1. Introduction')}</h2>
                        <p>{i18n.t('Aberration Labs, Inc. (“Company”, “we”, “us”, or “our”) respects the privacy of our users (“you”). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our InfiniTea App (“App”). By using the App, you consent to the data practices described in this policy.')}</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('2. Information We Collect')}</h2>
                        <p>{i18n.t('We may collect information about you in a variety of ways. The information we may collect via the App includes: Personal Data: Personally identifiable information, such as your email address, that you voluntarily give to us when you register with the App. Derivative Data: Information our servers automatically collect when you access the App, such as your native actions that are integral to the App, as well as other interactions with the App and other users via server log files.')}</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('3. Use of Information Collected')}</h2>
                        <p>{i18n.t('We use collected information to provide, operate, and maintain our App; to improve your experience with our App through personalized features and content; to understand and analyze how you use our App and to develop new products, services, features, and functionality.')}</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('4. Google Analytics, Smartlook & Clarity')}</h2>
                        <p>{i18n.t('Our site uses Google Analytics and Microsoft Clarity to provide you with the best experience on our website while our app uses SmartLook to help understand how our users use the App. These services collect information such as how often users visit the App, what pages they visit, and what other sites they used prior to coming to the App. We use the information we get from these services only to improve our App. These services collect the IP address assigned to you on the date you visit the App, rather than your name or other identifying information. We make every effort to anonymize when possible, and this data is never shared with any third party.')}</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('5. Disclosure of Your Information')}</h2>
                        <p>{i18n.t('We may share information we have collected about you in certain situations. Your information may be disclosed as follows: By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. Business Transfers: In the event we undergo a business transition, such as a merger or acquisition by another company, or sale of all or a portion of our assets, your information may be among the assets transferred.')}</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('6. Security of Your Information')}</h2>
                        <p>{i18n.t('We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.')}</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('7. Policy for Children')}</h2>
                        <p>{i18n.t('We do not knowingly collect personal information from children under the age of 13. If we learn that we have collected personal information from a child under the age of 13 without verification of parental consent, we will delete that information as quickly as possible. If you believe that we might have any information from or about a child under 13, please contact us at [support@aberrationlabs.com].')}</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('8. Options Regarding Your Information')}</h2>
                        <p>{i18n.t('Account Information: You may at any time review or change the information in your account or terminate your account by logging into your account settings and updating your account, or contacting us using the contact information provided below. Emails and Communications: If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by noting your preferences at the time you register your account with our App, logging into your account settings and updating your preferences, or contacting us using the contact information provided below.')}</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('9. Data Retention and Deletion')}</h2>
                        <p>{i18n.t('We will retain your personal information for as long as your account is active or as needed to provide you services. You can request to delete your personal information at any time by deleting your account through the App or by emailing us at support@aberrationlabs.com.')}</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('10. Changes to This Privacy Policy')}</h2>
                        <p>{i18n.t('We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our App, prior to the change becoming effective and update the “Last updated” date at the top of this Privacy Policy.')}</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">{i18n.t('11. Contact Us')}</h2>
                        <p>{i18n.t(`If you have questions or comments about this Privacy Policy, please contact us at `)}<a href={`mailto:support@aberrationlabs.com`}>support@aberrationlabs.com</a></p>
                    </li>
                </ol>
            </main>
        </Layout>
    );
};
