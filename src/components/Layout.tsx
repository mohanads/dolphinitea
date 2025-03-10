import { h } from 'preact';
import Header from './Header';
import Footer from './Footer';

export default ({ children }) => {
    return (
        <main className="min-h-screen bg-[#282b30] text-white flex flex-col">
            <div className="min-h-screen flex flex-col">
                <Header />
                {children}
            </div>
            <Footer />
        </main>
    );
};
