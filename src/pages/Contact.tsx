import { useLanguage } from '../contexts/LanguageContext';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('contactTitle')}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{t('address')}</p>
                <p className="text-gray-600 dark:text-gray-300">Kathmandu, Nepal</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{t('phone')}</p>
                <p className="text-gray-600 dark:text-gray-300">+977-1-4XXXXXX</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{t('email')}</p>
                <p className="text-gray-600 dark:text-gray-300">info@toledevelopment.org</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Send us a message</h2>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}