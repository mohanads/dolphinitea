import { h } from 'preact';
import Layout from '../components/Layout';

export default () => {
    return (
        <Layout>
            <main className="container px-6 py-6 mx-auto flex-grow flex flex-col overflow-auto no-scrollbar">
                <div>
                    <h1 className="text-4xl mb-6">Terms and Conditions</h1>
                </div>
                <ol className="flex flex-col gap-6">
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
                        <p>Welcome to the Aberration Labs, Inc. InfiniTea App (“App”), a platform where users(“You”) can integrate with an application bot, web platform, and mobile devices. Users of the App can interact, create, and edit content throughout the product. These Terms and Conditions (“Terms”) govern your use of the App and the services provided by Aberration Labs, Inc. (“Company”, “we”, “us”, or “our”).</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">2. Acceptance of Terms</h2>
                        <p>By accessing or using our App, you agree to be bound by these Terms and all terms incorporated by reference. If you do not agree to all of these terms, do not use our App.</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">3. Eligibility</h2>
                        <p>You must be at least 13 years old or the age of majority in your jurisdiction to use the App. By agreeing to these Terms, you represent and warrant that you meet this age requirement.</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">4. User Accounts</h2>
                        <p>To access and use certain features of the App, you must register for an account. By creating an account, you agree to (a) provide accurate, current, and complete account information, (b) maintain and promptly update your account information to keep it accurate, current, and complete, (c) maintain the security of your password, and (d) accept all risks of unauthorized access to your account.</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">5. Prohibited Activities</h2>
                        <p>In using the App, you must not engage in activities that: Violate any applicable law, contract, intellectual property, or other third-party right; Are harmful, fraudulent, deceptive, threatening, harassing, defamatory, obscene, or otherwise objectionable; Jeopardize the security of your App account or anyone else’s.</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">6. Indemnification</h2>
                        <p>You agree to indemnify, defend, and hold harmless the Company and its officers, directors, employees, and agents from any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys’ fees) arising out of or relating to your breach of these Terms or your use of the App, including, but not limited to any use of the App’s content, services, and products other than as expressly authorized in these Terms.</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">7. Limitation of Liability</h2>
                        <p>The Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the App; (b) any conduct or content of any third party on the App; (c) any content obtained from the App; and (d) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">8. Termination and Account Deletion</h2>
                        <p>You may deactivate your account and discontinue your use of the App at any time, either directly through the App or by contacting us at support@aberrationlabs.com. We reserve the right to suspend or terminate your access to the App at our discretion without notice or liability, for any reason, including but not limited to a breach of these Terms.</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">9. Changes to Terms</h2>
                        <p>We may modify these Terms at any time. We will provide notice of these changes by updating the date at the top of the Terms and, if significant changes are made, we will provide additional notice (such as adding a statement to our homepage or sending you a notification).</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">10. Governing Law</h2>
                        <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Company is established, without regard to its conflict of law principles.</p>
                    </li>
                    <li>
                        <h2 className="text-2xl font-semibold mb-2">11. Contact Information</h2>
                        <p>For any questions regarding these Terms, please contact us at <a href={`mailto:support@aberrationlabs.com`}>support@aberrationlabs.com</a>.</p>
                    </li>
                </ol>
            </main>
        </Layout>
    );
};
