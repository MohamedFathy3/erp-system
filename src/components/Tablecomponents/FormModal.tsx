// // components/SmartFormModal.tsx
// "use client";

// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { FormFieldComponent } from './FormFieldComponent';
// import { FormModalProps, FormField } from "@/types/generic-data-manager";

// type ModalType = 'simple' | 'tabs' | 'steps' | 'profile';

// const SmartFormModal: React.FC<FormModalProps & { 
//   compactLayout?: boolean;
//   defaultModalType?: ModalType;
// }> = ({
//   title, editingItem, formFields, formData, additionalQueries,
//   onFormDataChange, onSave, onClose, saveLoading,
//   compactLayout = false,
//   defaultModalType = 'simple'
// }) => {
//   const [activeTab, setActiveTab] = useState('basic');
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedModalType, setSelectedModalType] = useState<ModalType>(defaultModalType);

//   // تصنيف الحقول تلقائياً
//   const categorizeFields = () => {
//     const categories: { [key: string]: FormField[] } = {
//       basic: [],
//       personal: [],
//       security: [],
//       media: [],
//       other: []
//     };

//     formFields.forEach(field => {
//       if (field.type === 'image' || field.type === 'avatar' || field.type === 'logo' || field.type === 'file') {
//         categories.media.push(field);
//       } else if (field.type === 'password' || field.name.includes('password')) {
//         categories.security.push(field);
//       } else if (field.name.includes('name') || field.name.includes('email') || field.name.includes('phone')) {
//         categories.basic.push(field);
//       } else if (field.name.includes('address') || field.name.includes('birth') || field.name.includes('gender')) {
//         categories.personal.push(field);
//       } else {
//         categories.other.push(field);
//       }
//     });

//     // إزالة الفئات الفارغة
//     Object.keys(categories).forEach(key => {
//       if (categories[key].length === 0) {
//         delete categories[key];
//       }
//     });

//     return categories;
//   };

//   const categorizedFields = categorizeFields();

//   // دالة للحفظ والإستمرار
//   const handleSaveAndContinue = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await onSave(e, false);
//   };

//   // دالة للحفظ والإغلاق
//   const handleSaveAndClose = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await onSave(e, true);
//   };

//   // مكون أزرار الحفظ المشتركة
//   const renderSaveButtons = () => (
//     <div className="flex flex-col gap-3 mt-6">
//       <div className="flex gap-3">
//         <Button
//           type="button"
//           onClick={handleSaveAndContinue}
//           className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all rounded-xl font-semibold py-3 shadow-lg hover:shadow-xl group"
//           disabled={saveLoading}
//         >
//           {saveLoading ? (
//             <span className="flex items-center gap-2">
//               <i className="fas fa-spinner fa-spin"></i>
//               Saving...
//             </span>
//           ) : (
//             <span className="flex items-center gap-2">
//               <div className="bg-white/20 p-1 rounded-lg group-hover:scale-110 transition-transform">
//                 <i className="fas fa-save text-sm"></i>
//               </div>
//               Save & Continue
//             </span>
//           )}
//         </Button>

//         <Button
//           type="button"
//           onClick={handleSaveAndClose}
//           className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white transition-all rounded-xl font-semibold py-3 shadow-lg hover:shadow-xl group"
//           disabled={saveLoading}
//         >
//           {saveLoading ? (
//             <span className="flex items-center gap-2">
//               <i className="fas fa-spinner fa-spin"></i>
//               Saving...
//             </span>
//           ) : (
//             <span className="flex items-center gap-2">
//               <div className="bg-white/20 p-1 rounded-lg group-hover:scale-110 transition-transform">
//                 <i className="fas fa-check text-sm"></i>
//               </div>
//               {editingItem ? 'Update' : 'Save'}
//             </span>
//           )}
//         </Button>
//       </div>

//       <Button
//         type="button"
//         onClick={onClose}
//         variant="outline"
//         className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-all rounded-xl py-3 font-medium group"
//       >
//         <span className="flex items-center gap-2">
//           <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg group-hover:scale-110 transition-transform">
//             <i className="fas fa-times text-gray-600 dark:text-gray-400 text-sm"></i>
//           </div>
//           Cancel
//         </span>
//       </Button>
//     </div>
//   );

//   // مكون إختيار طريقة العرض
//   const renderViewSelector = () => (
//     <div className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
//       <button
//         onClick={() => setSelectedModalType('simple')}
//         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
//           selectedModalType === 'simple'
//             ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
//             : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
//         }`}
//       >
//         <i className="fas fa-list mr-2"></i>
//         Simple
//       </button>
//       <button
//         onClick={() => setSelectedModalType('tabs')}
//         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
//           selectedModalType === 'tabs'
//             ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
//             : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
//         }`}
//       >
//         <i className="fas fa-folder mr-2"></i>
//         Tabs
//       </button>
//       <button
//         onClick={() => setSelectedModalType('steps')}
//         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
//           selectedModalType === 'steps'
//             ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
//             : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
//         }`}
//       >
//         <i className="fas fa-footsteps mr-2"></i>
//         Steps
//       </button>
//       <button
//         onClick={() => setSelectedModalType('profile')}
//         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
//           selectedModalType === 'profile'
//             ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
//             : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
//         }`}
//       >
//         <i className="fas fa-user-circle mr-2"></i>
//         Profile
//       </button>
//     </div>
//   );

//   // 1. الموديل البسيط
//   const renderSimpleModal = () => (
//     <div className="space-y-4">
//       {formFields.map((field) => (
//         <FormFieldComponent
//           key={field.name}
//           field={field}
//           value={formData[field.name] || ""}
//           onChange={(value: any) => onFormDataChange({ ...formData, [field.name]: value })}
//           additionalQueries={additionalQueries}
//           formData={formData}
//           compact={compactLayout}
//         />
//       ))}
//       {renderSaveButtons()}
//     </div>
//   );

//   // 2. موديل التبويبات
//   const renderTabsModal = () => {
//     const tabLabels: { [key: string]: string } = {
//       basic: 'Basic Info',
//       personal: 'Personal Info',
//       security: 'Security',
//       media: 'Media',
//       other: 'Additional'
//     };

//     const tabIcons: { [key: string]: string } = {
//       basic: 'fa-user',
//       personal: 'fa-address-card',
//       security: 'fa-shield-alt',
//       media: 'fa-images',
//       other: 'fa-ellipsis-h'
//     };

//     return (
//       <div className="space-y-4">
//         {/* التبويبات */}
//         <div className="border-b border-gray-200 dark:border-gray-600">
//           <div className="flex gap-1 overflow-x-auto">
//             {Object.keys(categorizedFields).map(category => (
//               <button
//                 key={category}
//                 onClick={() => setActiveTab(category)}
//                 className={`flex items-center gap-2 px-4 py-3 font-medium text-sm rounded-t-lg transition-all whitespace-nowrap ${
//                   activeTab === category
//                     ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-b-2 border-indigo-500'
//                     : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
//                 }`}
//               >
//                 <i className={`fas ${tabIcons[category] || 'fa-circle'} text-xs`}></i>
//                 {tabLabels[category] || category}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* محتوى التبويب النشط */}
//         <div className="min-h-[300px] animate-fade-in">
//           <div className="grid gap-4">
//             {categorizedFields[activeTab]?.map((field) => (
//               <FormFieldComponent
//                 key={field.name}
//                 field={field}
//                 value={formData[field.name] || ""}
//                 onChange={(value: any) => onFormDataChange({ ...formData, [field.name]: value })}
//                 additionalQueries={additionalQueries}
//                 formData={formData}
//                 compact={false}
//               />
//             ))}
//           </div>
//         </div>

//         {renderSaveButtons()}
//       </div>
//     );
//   };

//   // 3. موديل الخطوات
//   const renderStepsModal = () => {
//     const steps = Object.keys(categorizedFields);
//     const stepLabels: { [key: string]: string } = {
//       basic: 'Basic Information',
//       personal: 'Personal Details',
//       security: 'Security Settings',
//       media: 'Media Upload',
//       other: 'Additional Info'
//     };

//     const stepIcons: { [key: string]: string } = {
//       basic: 'fa-user',
//       personal: 'fa-address-card',
//       security: 'fa-lock',
//       media: 'fa-camera',
//       other: 'fa-info-circle'
//     };

//     return (
//       <div className="space-y-6">
//         {/* مؤشر الخطوات */}
//         <div className="flex justify-between items-center px-4">
//           {steps.map((step, index) => (
//             <React.Fragment key={step}>
//               <div className="flex flex-col items-center">
//                 <button
//                   onClick={() => setCurrentStep(index + 1)}
//                   className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
//                     index + 1 === currentStep 
//                       ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg scale-110'
//                       : index + 1 < currentStep 
//                       ? 'border-green-500 bg-green-500 text-white'
//                       : 'border-gray-300 bg-white dark:bg-gray-700 text-gray-400'
//                   }`}
//                 >
//                   {index + 1 < currentStep ? (
//                     <i className="fas fa-check text-sm"></i>
//                   ) : (
//                     <i className={`fas ${stepIcons[step] || 'fa-circle'} text-xs`}></i>
//                   )}
//                 </button>
//                 <span className={`text-xs mt-2 text-center max-w-20 ${
//                   index + 1 === currentStep ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500'
//                 }`}>
//                   {stepLabels[step] || step}
//                 </span>
//               </div>
//               {index < steps.length - 1 && (
//                 <div className={`flex-1 h-1 mx-2 ${
//                   index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
//                 }`}></div>
//               )}
//             </React.Fragment>
//           ))}
//         </div>

//         {/* محتوى الخطوة الحالية */}
//         <div className="min-h-[300px] animate-fade-in">
//           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
//               <i className={`fas ${stepIcons[steps[currentStep - 1]]} text-indigo-600`}></i>
//               {stepLabels[steps[currentStep - 1]] || steps[currentStep - 1]}
//             </h3>
//             <div className="grid gap-4">
//               {categorizedFields[steps[currentStep - 1]]?.map((field) => (
//                 <FormFieldComponent
//                   key={field.name}
//                   field={field}
//                   value={formData[field.name] || ""}
//                   onChange={(value: any) => onFormDataChange({ ...formData, [field.name]: value })}
//                   additionalQueries={additionalQueries}
//                   formData={formData}
//                   compact={false}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* أزرار التنقل بين الخطوات */}
//         <div className="flex justify-between">
//           <Button
//             type="button"
//             onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
//             disabled={currentStep === 1}
//             variant="outline"
//             className="px-6"
//           >
//             <i className="fas fa-arrow-left mr-2"></i>
//             Previous
//           </Button>

//           {currentStep < steps.length ? (
//             <Button
//               type="button"
//               onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
//               className="px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg"
//             >
//               Next
//               <i className="fas fa-arrow-right ml-2"></i>
//             </Button>
//           ) : (
//             <div className="flex gap-3">
//               {renderSaveButtons()}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // 4. موديل البروفايل
//   const renderProfileModal = () => {
//     const sectionIcons: { [key: string]: string } = {
//       basic: 'fa-user-circle',
//       personal: 'fa-address-card',
//       security: 'fa-shield-alt',
//       media: 'fa-images',
//       other: 'fa-info-circle'
//     };

//     const sectionColors: { [key: string]: string } = {
//       basic: 'from-blue-500 to-indigo-600',
//       personal: 'from-green-500 to-emerald-600',
//       security: 'from-red-500 to-rose-600',
//       media: 'from-purple-500 to-pink-600',
//       other: 'from-gray-500 to-gray-600'
//     };

//     return (
//       <div className="space-y-6">
//         {Object.entries(categorizedFields).map(([category, fields]) => (
//           <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
//             <div className={`bg-gradient-to-r ${sectionColors[category] || 'from-gray-500 to-gray-600'} p-4`}>
//               <h3 className="text-lg font-semibold text-white flex items-center gap-2">
//                 <i className={`fas ${sectionIcons[category]} text-white`}></i>
//                 {category === 'basic' && 'Basic Information'}
//                 {category === 'personal' && 'Personal Details'}
//                 {category === 'security' && 'Security Settings'}
//                 {category === 'media' && 'Media Upload'}
//                 {category === 'other' && 'Additional Information'}
//               </h3>
//             </div>
//             <div className="p-6">
//               <div className="grid gap-4">
//                 {fields.map((field) => (
//                   <FormFieldComponent
//                     key={field.name}
//                     field={field}
//                     value={formData[field.name] || ""}
//                     onChange={(value: any) => onFormDataChange({ ...formData, [field.name]: value })}
//                     additionalQueries={additionalQueries}
//                     formData={formData}
//                     compact={false}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//         {renderSaveButtons()}
//       </div>
//     );
//   };

//   // تحديد الموديل المراد عرضه
//   const renderModalContent = () => {
//     switch (selectedModalType) {
//       case 'tabs':
//         return renderTabsModal();
//       case 'steps':
//         return renderStepsModal();
//       case 'profile':
//         return renderProfileModal();
//       case 'simple':
//       default:
//         return renderSimpleModal();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl ${
//         selectedModalType === 'profile' ? 'w-full max-w-2xl' : 
//         selectedModalType === 'steps' ? 'w-full max-w-3xl' :
//         compactLayout ? 'w-full max-w-4xl' : 'w-full max-w-md'
//       } p-6 relative max-h-[90vh] overflow-y-auto`}>
        
//         {/* زر الإغلاق */}
//         <button 
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
//         >
//           ✖
//         </button>
        
//         {/* الهيدر */}
//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             {editingItem ? `Edit ${title}` : `Add ${title}`}
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//             Choose your preferred view style
//           </p>
//         </div>
        
//         {/* إختيار طريقة العرض */}
//         {renderViewSelector()}
        
//         {/* محتوى الموديل */}
//         <div className="mt-4">
//           {renderModalContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SmartFormModal;