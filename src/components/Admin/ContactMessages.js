// src/components/Admin/ContactMessages.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FaEye, FaEyeSlash, FaPhone, FaEnvelope, FaCalendar, FaWhatsapp } from 'react-icons/fa';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (messageId) => {
    await updateDoc(doc(db, "contactMessages", messageId), {
      read: true,
      readAt: new Date()
    });
  };

  const markAsUnread = async (messageId) => {
    await updateDoc(doc(db, "contactMessages", messageId), {
      read: false
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleString('ar-SA');
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">طلبات الاستفسار</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قائمة الرسائل */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map((message) => (
                    <tr 
                      key={message.id}
                      className={`hover:bg-gray-50 cursor-pointer ${!message.read ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {message.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {message.projectType || 'لا يوجد'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{message.phone}</div>
                        {message.email && (
                          <div className="text-sm text-gray-500">{message.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          message.read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {message.read ? 'تم القراءة' : 'جديد'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (message.read) {
                              markAsUnread(message.id);
                            } else {
                              markAsRead(message.id);
                            }
                          }}
                          className={`mr-2 ${message.read ? 'text-gray-600' : 'text-blue-600'}`}
                        >
                          {message.read ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* تفاصيل الرسالة */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">تفاصيل الرسالة</h2>
                {!selectedMessage.read && (
                  <button
                    onClick={() => markAsRead(selectedMessage.id)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg"
                  >
                    تمت القراءة
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">الاسم</div>
                  <div className="font-semibold">{selectedMessage.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">الهاتف</div>
                    <div className="font-semibold">{selectedMessage.phone}</div>
                    <a 
                      href={`tel:${selectedMessage.phone}`}
                      className="text-blue-600 text-sm flex items-center gap-1 mt-1"
                    >
                      <FaPhone className="text-xs" /> اتصل
                    </a>
                    <a 
                      href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                      className="text-green-600 text-sm flex items-center gap-1 mt-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp className="text-xs" /> واتساب
                    </a>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">البريد الإلكتروني</div>
                    <div className="font-semibold text-sm truncate">{selectedMessage.email}</div>
                    {selectedMessage.email && (
                      <a 
                        href={`mailto:${selectedMessage.email}`}
                        className="text-blue-600 text-sm flex items-center gap-1 mt-1"
                      >
                        <FaEnvelope className="text-xs" /> إرسال بريد
                      </a>
                    )}
                  </div>
                </div>

                {selectedMessage.service && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">الخدمة المطلوبة</div>
                    <div className="font-semibold">{selectedMessage.service}</div>
                  </div>
                )}

                {selectedMessage.budget && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">الميزانية</div>
                    <div className="font-semibold">{selectedMessage.budget}</div>
                  </div>
                )}

                {selectedMessage.projectType && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">نوع المشروع</div>
                    <div className="font-semibold">{selectedMessage.projectType}</div>
                  </div>
                )}

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">الرسالة</div>
                  <div className="mt-2 whitespace-pre-line">{selectedMessage.message}</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">المعلومات الإضافية</div>
                  <div className="mt-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-gray-400" />
                      <span>التاريخ: {formatDate(selectedMessage.createdAt)}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-gray-500">اللغة: </span>
                      <span>{selectedMessage.language === 'ar' ? 'عربية' : 'إنجليزية'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
              اختر رسالة لعرض تفاصيلها
            </div>
          )}
        </div>
      </div>
    </div>
  );
}