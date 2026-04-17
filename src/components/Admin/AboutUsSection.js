// /Users/ayatnidal/Desktop/decor-website/decor-website-react/src/components/Admin/AboutUsSection.js
import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase";
import { 
    doc, serverTimestamp,getDoc, setDoc
} from "firebase/firestore";

// SVG Icons
const IconCheck = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconX = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconAbout = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconInfo = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconUsers = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a4 4 0 110 5.292M15 10a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconFolder = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const IconTrash = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconPlus = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

// ==============================
// مكون About Us Section
// ==============================
const AboutUsSection = () => {
  const [aboutContent, setAboutContent] = useState({
    heroTitle: { ar: "", en: "" },
    heroSubtitle: { ar: "", en: "" },
    storyTitle: { ar: "", en: "" },
    storyContent: { ar: "", en: "" },
    missionTitle: { ar: "", en: "" },
    missionContent: { ar: "", en: "" },
    visionTitle: { ar: "", en: "" },
    visionContent: { ar: "", en: "" },
    valuesTitle: { ar: "", en: "" },
    teamTitle: { ar: "", en: "" },
    teamSubtitle: { ar: "", en: "" },
    whyChooseUsTitle: { ar: "", en: "" },
    whyChooseUsSubtitle: { ar: "", en: "" }
  });

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: { ar: "", en: "" }, position: { ar: "", en: "" }, image: "", description: { ar: "", en: "" }, social: { linkedin: "", twitter: "", instagram: "", behance: "" } }
  ]);

  const [statistics, setStatistics] = useState({
    completedProjects: 0,
    happyClients: 0,
    yearsExperience: 0,
    teamMembers: 0
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  const fetchAboutData = useCallback(async () => {
    try {
      setLoading(true);
      
      // جلب بيانات صفحة About
      const aboutDoc = await getDoc(doc(db, "pageContent", "about"));
      if (aboutDoc.exists()) {
        setAboutContent(aboutDoc.data());
      }

      // جلب أعضاء الفريق
      const teamDoc = await getDoc(doc(db, "siteContent", "team-members"));
      if (teamDoc.exists()) {
        const data = teamDoc.data();
        if (data.members && Array.isArray(data.members)) {
          setTeamMembers(data.members);
        }
      }

      // جلب الإحصائيات
      const statsDoc = await getDoc(doc(db, "siteStatistics", "main-stats"));
      if (statsDoc.exists()) {
        setStatistics(statsDoc.data());
      }

    } catch (error) {
      console.error("Error fetching about data:", error);
      showNotification("error", "❌ حدث خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // حفظ بيانات صفحة About
      await setDoc(doc(db, "pageContent", "about"), {
        ...aboutContent,
        updatedAt: serverTimestamp()
      });

      // حفظ أعضاء الفريق
      await setDoc(doc(db, "siteContent", "team-members"), {
        members: teamMembers,
        updatedAt: serverTimestamp()
      });

      // حفظ الإحصائيات
      await setDoc(doc(db, "siteStatistics", "main-stats"), {
        ...statistics,
        updatedAt: serverTimestamp()
      });

      showNotification("success", "✅ تم حفظ بيانات صفحة About Us بنجاح!");
    } catch (error) {
      console.error("Error saving about data:", error);
      showNotification("error", "❌ حدث خطأ في حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, {
      id: teamMembers.length + 1,
      name: { ar: "", en: "" },
      position: { ar: "", en: "" },
      image: "",
      description: { ar: "", en: "" },
      social: { linkedin: "", twitter: "", instagram: "", behance: "" }
    }]);
  };

  const handleRemoveTeamMember = (index) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'name' || parent === 'position' || parent === 'description') {
        updatedMembers[index] = {
          ...updatedMembers[index],
          [parent]: {
            ...updatedMembers[index][parent],
            [child]: value
          }
        };
      } else if (parent === 'social') {
        updatedMembers[index] = {
          ...updatedMembers[index],
          social: {
            ...updatedMembers[index].social,
            [child]: value
          }
        };
      }
    } else {
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value
      };
    }
    setTeamMembers(updatedMembers);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleTeamMemberChange(index, 'image', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <p className="mr-4 text-gray-600">جاري تحميل بيانات صفحة About Us...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {notification.show && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 transform transition-all duration-300 ${
          notification.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
          <div className={`p-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? 
                <IconCheck className="w-5 h-5 ml-2" /> : 
                <IconX className="w-5 h-5 ml-2" />
              }
              <span>{notification.message}</span>
              <button 
                onClick={() => setNotification({ show: false, type: '', message: '' })}
                className="mr-auto text-white/80 hover:text-white"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSaveAbout} className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
            <IconAbout className="ml-2" />
            قسم الرئيسي (Hero Section)
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان الرئيسي (عربي)
              </label>
              <textarea 
                value={aboutContent.heroTitle?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, heroTitle: {...aboutContent.heroTitle, ar: e.target.value}})} 
                rows="2" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="عنوان الصفحة الرئيسي بالعربية"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الرئيسي (إنجليزي)
              </label>
              <textarea 
                value={aboutContent.heroTitle?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, heroTitle: {...aboutContent.heroTitle, en: e.target.value}})} 
                rows="2" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Hero title in English"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف الرئيسي (عربي)
              </label>
              <textarea 
                value={aboutContent.heroSubtitle?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, heroSubtitle: {...aboutContent.heroSubtitle, ar: e.target.value}})} 
                rows="3" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="وصف قصير للصفحة بالعربية"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف الرئيسي (إنجليزي)
              </label>
              <textarea 
                value={aboutContent.heroSubtitle?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, heroSubtitle: {...aboutContent.heroSubtitle, en: e.target.value}})} 
                rows="3" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Hero subtitle in English"
              />
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <IconInfo className="ml-2" />
            قصة ديمور (Our Story)
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان القصة (عربي)
              </label>
              <input 
                type="text" 
                value={aboutContent.storyTitle?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, storyTitle: {...aboutContent.storyTitle, ar: e.target.value}})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="عنوان قصة الشركة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان القصة (إنجليزي)
              </label>
              <input 
                type="text" 
                value={aboutContent.storyTitle?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, storyTitle: {...aboutContent.storyTitle, en: e.target.value}})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Our Story Title"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محتوى القصة (عربي)
              </label>
              <textarea 
                value={aboutContent.storyContent?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, storyContent: {...aboutContent.storyContent, ar: e.target.value}})} 
                rows="6" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="تفاصيل قصة الشركة بالعربية"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محتوى القصة (إنجليزي)
              </label>
              <textarea 
                value={aboutContent.storyContent?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, storyContent: {...aboutContent.storyContent, en: e.target.value}})} 
                rows="6" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Our story details in English"
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">الرسالة (Mission)</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الرسالة (عربي)
              </label>
              <input 
                type="text" 
                value={aboutContent.missionTitle?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, missionTitle: {...aboutContent.missionTitle, ar: e.target.value}})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الرسالة (إنجليزي)
              </label>
              <input 
                type="text" 
                value={aboutContent.missionTitle?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, missionTitle: {...aboutContent.missionTitle, en: e.target.value}})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محتوى الرسالة (عربي)
              </label>
              <textarea 
                value={aboutContent.missionContent?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, missionContent: {...aboutContent.missionContent, ar: e.target.value}})} 
                rows="4" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محتوى الرسالة (إنجليزي)
              </label>
              <textarea 
                value={aboutContent.missionContent?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, missionContent: {...aboutContent.missionContent, en: e.target.value}})} 
                rows="4" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">الرؤية (Vision)</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الرؤية (عربي)
              </label>
              <input 
                type="text" 
                value={aboutContent.visionTitle?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, visionTitle: {...aboutContent.visionTitle, ar: e.target.value}})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الرؤية (إنجليزي)
              </label>
              <input 
                type="text" 
                value={aboutContent.visionTitle?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, visionTitle: {...aboutContent.visionTitle, en: e.target.value}})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محتوى الرؤية (عربي)
              </label>
              <textarea 
                value={aboutContent.visionContent?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, visionContent: {...aboutContent.visionContent, ar: e.target.value}})} 
                rows="4" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محتوى الرؤية (إنجليزي)
              </label>
              <textarea 
                value={aboutContent.visionContent?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, visionContent: {...aboutContent.visionContent, en: e.target.value}})} 
                rows="4" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-pink-800 flex items-center">
              <IconUsers className="ml-2" />
              فريق العمل (Team Members)
            </h3>
            <button
              type="button"
              onClick={handleAddTeamMember}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 flex items-center"
            >
              <IconPlus className="ml-2" />
              إضافة عضو جديد
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-pink-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-800">عضو #{index + 1}</h4>
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTeamMember(index)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <IconTrash className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم (عربي)
                    </label>
                    <input 
                      type="text" 
                      value={member.name?.ar || ""} 
                      onChange={(e) => handleTeamMemberChange(index, 'name.ar', e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="اسم العضو بالعربية"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم (إنجليزي)
                    </label>
                    <input 
                      type="text" 
                      value={member.name?.en || ""} 
                      onChange={(e) => handleTeamMemberChange(index, 'name.en', e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Member name in English"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المسمى الوظيفي (عربي)
                    </label>
                    <input 
                      type="text" 
                      value={member.position?.ar || ""} 
                      onChange={(e) => handleTeamMemberChange(index, 'position.ar', e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="المسمى الوظيفي بالعربية"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المسمى الوظيفي (إنجليزي)
                    </label>
                    <input 
                      type="text" 
                      value={member.position?.en || ""} 
                      onChange={(e) => handleTeamMemberChange(index, 'position.en', e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Position in English"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صورة العضو
                    </label>
                    
                    {member.image && (
                      <div className="mb-3">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <img 
                            src={member.image} 
                            alt="صورة العضو" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150?text=صورة";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleTeamMemberChange(index, 'image', '')}
                            className="absolute top-1 left-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md"
                          >
                            <IconX className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <label className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-lg cursor-pointer transition-all duration-300 hover:from-pink-600 hover:to-pink-700 shadow-sm">
                      <IconFolder className="ml-2" />
                      <span>{member.image ? "تغيير الصورة" : "اختر صورة"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="hidden"
                      />
                    </label>
                    
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        أو أدخل رابط الصورة:
                      </label>
                      <input 
                        type="url" 
                        value={member.image || ""} 
                        onChange={(e) => handleTeamMemberChange(index, 'image', e.target.value)} 
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوصف (عربي)
                    </label>
                    <textarea 
                      value={member.description?.ar || ""} 
                      onChange={(e) => handleTeamMemberChange(index, 'description.ar', e.target.value)} 
                      rows="2" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="وصف قصير عن العضو"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوصف (إنجليزي)
                    </label>
                    <textarea 
                      value={member.description?.en || ""} 
                      onChange={(e) => handleTeamMemberChange(index, 'description.en', e.target.value)} 
                      rows="2" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Short description in English"
                    />
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input 
                      type="url" 
                      value={member.social?.linkedin || ""} 
                      onChange={(e) => handleTeamMemberChange(index, 'social.linkedin', e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input 
                      type="url" 
                      value={member.social?.twitter || ""} 
                      onChange={(e) => handleTeamMemberChange(index, 'social.twitter', e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input 
                      type="url" 
                      value={member.social?.instagram || ""} 
                      onChange={(e) => handleTeamMemberChange(index, 'social.instagram', e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Behance
                    </label>
                    <input 
                      type="url" 
                      value={member.social?.behance || ""} 
                      onChange={(e) => handleTeamMemberChange(index, 'social.behance', e.target.value)} 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="https://behance.net/..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">الإحصائيات (Statistics)</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المشاريع المكتملة
              </label>
              <input 
                type="number" 
                value={statistics.completedProjects || 0} 
                onChange={(e) => setStatistics({...statistics, completedProjects: parseInt(e.target.value) || 0})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العملاء السعداء
              </label>
              <input 
                type="number" 
                value={statistics.happyClients || 0} 
                onChange={(e) => setStatistics({...statistics, happyClients: parseInt(e.target.value) || 0})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سنوات الخبرة
              </label>
              <input 
                type="number" 
                value={statistics.yearsExperience || 0} 
                onChange={(e) => setStatistics({...statistics, yearsExperience: parseInt(e.target.value) || 0})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                أعضاء الفريق
              </label>
              <input 
                type="number" 
                value={statistics.teamMembers || 0} 
                onChange={(e) => setStatistics({...statistics, teamMembers: parseInt(e.target.value) || 0})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">محتوى إضافي</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان القيم (عربي)
              </label>
              <input 
                type="text" 
                value={aboutContent.valuesTitle?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, valuesTitle: {...aboutContent.valuesTitle, ar: e.target.value}})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان القيم (إنجليزي)
              </label>
              <input 
                type="text" 
                value={aboutContent.valuesTitle?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, valuesTitle: {...aboutContent.valuesTitle, en: e.target.value}})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان لماذا تختارنا (عربي)
              </label>
              <input 
                type="text" 
                value={aboutContent.whyChooseUsTitle?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, whyChooseUsTitle: {...aboutContent.whyChooseUsTitle, ar: e.target.value}})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان لماذا تختارنا (إنجليزي)
              </label>
              <input 
                type="text" 
                value={aboutContent.whyChooseUsTitle?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, whyChooseUsTitle: {...aboutContent.whyChooseUsTitle, en: e.target.value}})} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف لماذا تختارنا (عربي)
              </label>
              <textarea 
                value={aboutContent.whyChooseUsSubtitle?.ar || ""} 
                onChange={(e) => setAboutContent({...aboutContent, whyChooseUsSubtitle: {...aboutContent.whyChooseUsSubtitle, ar: e.target.value}})} 
                rows="3" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف لماذا تختارنا (إنجليزي)
              </label>
              <textarea 
                value={aboutContent.whyChooseUsSubtitle?.en || ""} 
                onChange={(e) => setAboutContent({...aboutContent, whyChooseUsSubtitle: {...aboutContent.whyChooseUsSubtitle, en: e.target.value}})} 
                rows="3" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <IconCheck className="ml-2" />
                حفظ بيانات About Us
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutUsSection;