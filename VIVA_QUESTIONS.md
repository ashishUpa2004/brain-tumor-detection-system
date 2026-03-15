# COGNITIVE - Complete Viva Questions & Answers
> Brain Tumor Detection System | Frontend + Backend + Model
> Easy | Medium | Hard | Personal Experience Questions

---

# PART 1: FRONTEND (React + TypeScript)

## 🟢 EASY

**Q1. Frontend mein tumne kaunsi technology use ki?**
> React 18 with TypeScript, Vite as build tool, Tailwind CSS for styling.

**Q2. TypeScript kyun use kiya, plain JavaScript kyun nahi?**
> TypeScript se type safety milti hai. Agar koi wrong type pass karo toh compile time pe hi error aa jaata hai, runtime pe nahi. Large codebase mein bugs kam hote hain.

**Q3. Tailwind CSS kya hota hai?**
> Utility-first CSS framework hai. Har CSS property ke liye pre-defined classes hoti hain jaise `bg-blue-500`, `text-xl`, `flex`, `rounded-lg`. Alag CSS file likhne ki zaroorat nahi.

**Q4. React mein component kya hota hai?**
> Reusable UI piece hota hai. Jaise hamara `UploadForm`, `ResultsDisplay`, `GradCAMVisualization` - yeh sab alag-alag components hain jo milke poora page banate hain.

**Q5. useState kya karta hai?**
> React hook hai jo component ke andar state manage karta hai. Jaise `const [isAnalyzing, setIsAnalyzing] = useState(false)` - jab state change hoti hai toh component re-render hota hai.

**Q6. Dark/Light theme kaise implement ki?**
> Tailwind CSS ka `dark:` prefix use kiya. HTML element pe `dark` class toggle hoti hai. `localStorage` mein theme save hoti hai taaki page reload pe bhi yaad rahe.

**Q7. Drag and Drop kaise implement kiya?**
> HTML5 native drag events use kiye - `onDragOver`, `onDragLeave`, `onDrop`. File drop hone pe `handleFileSelection()` call hoti hai.

---

## 🟡 MEDIUM

**Q8. JWT token frontend mein kahan store kiya aur kyun?**
> `localStorage` mein store kiya. Har API call mein `Authorization: Bearer <token>` header mein bheja. Production mein `httpOnly cookie` better hoti hai XSS attacks se bachne ke liye, lekin simplicity ke liye localStorage use kiya.

**Q9. Axios interceptor kya karta hai tumhare project mein?**
> Request interceptor har outgoing request mein automatically JWT token inject karta hai. Response interceptor 401 error pe automatically logout karta hai aur login page pe redirect karta hai.

**Q10. GradCAM image ko `<img src="">` se directly kyun nahi dikhaya?**
> Kyunki `/api/heatmap/{id}` endpoint protected hai - JWT token chahiye. Plain `<img src>` tag mein auth header nahi bhej sakte. Isliye `apiClient.get()` se blob fetch kiya aur `URL.createObjectURL()` se temporary URL banaya.

**Q11. Blob URL kya hota hai aur cleanup kyun zaroori hai?**
> `URL.createObjectURL()` browser memory mein ek temporary URL banata hai. Agar cleanup nahi kiya toh memory leak hoti hai. Isliye component unmount hone pe `URL.revokeObjectURL()` call kiya.

**Q12. Split screen layout kaise banaya?**
> Tailwind ka `grid grid-cols-1 lg:grid-cols-2` use kiya. Mobile pe single column, large screen pe 2 columns automatically.

**Q13. Loading animation kaise banaya?**
> Pure CSS + Tailwind animations. `animate-spin` rotating arc ke liye, `animate-pulse` inner circle ke liye, `animate-bounce` dots ke liye. Koi external library nahi.

**Q14. History se scan select karne pe original MRI kyun nahi dikh rahi thi pehle?**
> Bug tha - `handleScanClick` mein `mriImageUrl` ke jagah `gradCamUrl` pass ho raha tha. Matlab heatmap hi MRI ki jagah show ho rahi thi. Fix: backend mein `/api/image/{id}` endpoint banaya aur sahi URL pass kiya.

---

## 🔴 HARD

**Q15. useEffect ke cleanup function ka kya role hai tumhare GradCAMVisualization component mein?**
> Pehle bug tha - `useEffect` cleanup `[heatmapBlobUrl, mriBlobUrl]` dependency pe tha. Jab heatmap load hoti thi, cleanup run hota tha aur `mriBlobUrl` revoke ho jaata tha. Toggle OFF karne pe MRI black dikhti thi. Fix: `useRef` se blob URLs track kiye, cleanup sirf unmount pe hota hai `[]` dependency se.

**Q16. Race condition kya hoti hai aur tumne kaise handle ki?**
> Jab user quickly different scans select kare, multiple async fetch calls chal sakti hain. Pehli call baad mein complete ho sakti hai. Fix: `cancelled` flag use kiya - agar component unmount ho gaya ya new request aa gayi toh purani response ignore ho jaati hai.

**Q17. TypeScript mein `interface` aur `type` mein kya difference hai?**
> `interface` extendable hai (declaration merging), `type` mein union/intersection types possible hain. Hamne `interface` use kiya component props ke liye jaise `GradCAMVisualizationProps`, `ResultsDisplayProps`.

**Q18. Vite kyun use kiya Create React App ki jagah?**
> Vite bahut fast hai - ES modules use karta hai development mein, HMR (Hot Module Replacement) instant hai. CRA webpack use karta hai jo slow hai. Build time bhi Vite mein kam hota hai.

---

# PART 2: BACKEND (Django + FastAPI)

## 🟢 EASY

**Q19. Backend mein kaunsi technologies use ki?**
> Django ORM + models ke liye, FastAPI REST API endpoints ke liye. Dono ek saath run hote hain - FastAPI Django ko mount karta hai.

**Q20. FastAPI aur Django mein kya difference hai?**
> FastAPI: Modern, async, fast, automatic API docs (`/docs`), type hints se validation. Django: Full-featured framework, ORM, admin panel, migrations. Hamne dono ka best use kiya.

**Q21. JWT token kya hota hai?**
> JSON Web Token - 3 parts hote hain: Header.Payload.Signature. User login kare toh server token generate karta hai. Har request mein yeh token bheja jaata hai. Server verify karta hai bina database hit kiye.

**Q22. API endpoints kaunse hain tumhare project mein?**
> - `POST /api/auth/signup` - Register
> - `POST /api/auth/login` - Login
> - `POST /api/predict/` - MRI scan predict
> - `GET /api/history` - Scan history
> - `GET /api/report/{id}` - PDF download
> - `GET /api/heatmap/{id}` - Heatmap image
> - `GET /api/image/{id}` - Original MRI image

**Q23. Database mein kaunse tables hain?**
> 3 main tables: `users` (id, email, name, password_hash), `patients` (id, name, age, gender), `scans` (id, user_id, patient_id, image_path, prediction, confidence, heatmap_path, report_path, created_at)

**Q24. CORS kya hota hai aur kyun configure kiya?**
> Cross-Origin Resource Sharing. Browser security feature hai - ek domain ka JavaScript dusre domain ke API ko call nahi kar sakta by default. Frontend `localhost:5173` se backend `localhost:8000` pe call karta hai, isliye CORS allow karna pada.

---

## 🟡 MEDIUM

**Q25. Password kaise store kiya database mein?**
> Plain text mein nahi. Django ka `create_user()` automatically `bcrypt` hashing use karta hai. Database mein sirf hash store hota hai. Login pe `user.check_password()` se verify kiya jaata hai.

**Q26. `sync_to_async` kyun use kiya?**
> FastAPI async hai lekin Django ORM synchronous hai. Dono ko saath use karne ke liye `asgiref.sync_to_async` wrapper use kiya. Isse async FastAPI endpoint mein Django database queries run ho sakti hain.

**Q27. File upload kaise handle kiya?**
> FastAPI ka `UploadFile` use kiya. File `uploads/` directory mein save ki. Path database mein store kiya. `os.makedirs()` se directory automatically create hoti hai agar exist nahi karti.

**Q28. PDF report kaise generate kiya?**
> `ReportLab` library use ki. Canvas pe manually text, lines, images draw kiye. IST timezone ke liye `pytz` use kiya. Dual image layout - Original MRI aur Grad-CAM side by side.

**Q29. `FileResponse` mein `os.path.abspath()` kyun use kiya?**
> `image_path` database mein relative path save hai (`uploads\file.png`). Server `backend_temp/` se run hota hai. `abspath()` relative path ko absolute mein convert karta hai taaki file correctly serve ho.

**Q30. Heatmap path absolute kyun save kiya aur image path relative kyun?**
> Yeh ek inconsistency thi jo develop hote waqt aayi. `generate_heatmap_async()` mein `os.path.abspath()` use kiya tha isliye absolute save hua. Dono ke liye `abspath()` use karna better practice hai.

---

## 🔴 HARD

**Q31. Django aur FastAPI ko ek saath kaise integrate kiya?**
> `run_server.py` mein `uvicorn` se FastAPI app run kiya. FastAPI app mein `django.setup()` call kiya taaki Django ORM initialize ho. Phir Django models directly FastAPI endpoints mein use kar sake.

**Q32. Async endpoint mein synchronous Django ORM kyun problem karta hai?**
> FastAPI async event loop pe run karta hai. Synchronous blocking calls (jaise Django ORM queries) event loop ko block kar deti hain - dusri requests process nahi ho paatein. `sync_to_async` isse thread pool mein run karta hai.

**Q33. JWT token expiry aur refresh kaise handle kiya?**
> `create_jwt_token()` mein expiry set ki. `verify_jwt_token()` FastAPI dependency hai jo har protected endpoint pe automatically token verify karta hai. Token expire hone pe 401 return hota hai, frontend automatically logout karta hai.

---

# PART 3: ML MODEL (VGG16 + Grad-CAM)

## 🟢 EASY

**Q34. Tumne kaunsa ML model use kiya?**
> VGG16 - Visual Geometry Group ka 16-layer deep CNN. Transfer learning approach use ki - ImageNet pe pre-trained model liya aur brain tumor classification ke liye fine-tune kiya.

**Q35. Transfer Learning kya hota hai?**
> Ek already trained model ko naye task ke liye reuse karna. VGG16 ImageNet pe 1.2 million images se train hua hai - edges, textures, shapes pehchanta hai. Hamne sirf top layers change kiye brain tumor classification ke liye.

**Q36. Tumhare model mein kitne classes hain?**
> 4 classes: Glioma, Meningioma, No Tumor, Pituitary. Alphabetical order mein train kiya: `['glioma', 'meningioma', 'notumor', 'pituitary']`

**Q37. Image preprocessing kya kiya?**
> - Resize to 128x128 pixels
> - RGB convert (grayscale images ke liye)
> - Normalize: pixel values 0-255 ko 0-1 mein convert (÷255)
> - Batch dimension add: shape (128,128,3) → (1,128,128,3)

**Q38. Softmax kya karta hai?**
> Last layer mein 4 raw scores (logits) ko probabilities mein convert karta hai jo sum to 1 hoti hain. Jaise [2.1, 8.3, 0.5, 1.2] → [0.02, 0.91, 0.03, 0.04]

**Q39. Confidence score kya hota hai?**
> Softmax output ka maximum value. Agar model ne meningioma predict kiya aur probability 0.91 hai toh confidence = 91%. Yeh model ki certainty hai, medical certainty nahi.

---

## 🟡 MEDIUM

**Q40. VGG16 architecture explain karo.**
> 16 weight layers hain:
> - 13 Convolutional layers (3x3 filters, ReLU activation)
> - 5 Max Pooling layers
> - 3 Fully Connected layers
> Hamne last FC layers replace kiye apne custom classifier se (Dense 256 + Dropout + Dense 4).

**Q41. Dropout kyun use kiya?**
> Overfitting rokne ke liye. Training mein randomly 50% neurons off ho jaate hain (`Dropout(0.5)`). Model zyada generalize karta hai, specific neurons pe dependent nahi hota.

**Q42. Grad-CAM kaise kaam karta hai step by step?**
> 1. Image forward pass karo, last conv layer (`block5_conv3`) ka output save karo
> 2. Target class ke score ka gradient compute karo w.r.t. conv output
> 3. Gradients ko globally average pool karo → importance weights
> 4. Conv feature maps ko weights se multiply karo aur sum karo → heatmap
> 5. ReLU apply karo (negative values ignore)
> 6. Resize to original image size
> 7. JET colormap apply karo

**Q43. `block5_conv3` kyun choose kiya Grad-CAM ke liye?**
> Last convolutional layer highest-level features capture karta hai - most abstract, semantically meaningful. Earlier layers low-level features (edges, textures) capture karte hain jo less informative hain for visualization.

**Q44. `tf.Variable` aur `tf.GradientTape` ka kya role hai?**
> `GradientTape` gradients track karta hai. Lekin yeh sirf `tf.Variable` ke gradients track karta hai by default. Conv output ek regular tensor tha, isliye `tf.Variable(conv_outputs)` se wrap kiya taaki gradients compute ho sakein.

**Q45. Class imbalance kya hoti hai aur tumhare dataset mein thi?**
> Jab ek class ke samples dusre se bahut zyada ho. Hamara dataset roughly balanced tha (~900 each) lekin `notumor` thoda kam tha (~500). Ideally `class_weight` parameter use karna chahiye tha training mein.

---

## 🔴 HARD

**Q46. VGG16 nested model mein Grad-CAM implement karna kyun mushkil tha?**
> Hamara model structure tha: `outer_model → vgg16 (nested) → custom_head`. Simple Grad-CAM directly `model.get_layer('block5_conv3')` se kaam nahi karta kyunki layer nested hai. Solution: Do alag models banaye - `conv_model` (nested VGG16 input → conv output) aur `classifier_model` (conv output → final prediction). Phir `tf.Variable` se gradients compute kiye.

**Q47. Overfitting aur underfitting mein kya difference hai? Tumhare model mein kya tha?**
> Overfitting: Training accuracy high, validation accuracy low - model training data memorize kar leta hai. Underfitting: Dono low - model kuch seekha hi nahi. Hamara model thoda overfit tha isliye Dropout(0.5) aur data augmentation use kiya.

**Q48. Batch normalization kya hoti hai? VGG16 mein hai?**
> Har layer ke output ko normalize karta hai - training stable aur fast hoti hai. Original VGG16 mein batch normalization nahi thi, lekin VGG16-BN variant mein hai. Hamne standard VGG16 use kiya.

**Q49. ImageNet pe train model brain MRI pe kaise kaam karta hai?**
> Domain shift problem hai - natural images aur medical images bahut different hain. Lekin low-level features (edges, textures, shapes) similar hote hain. Transfer learning mein early layers freeze kiye (jo basic features detect karte hain) aur only top layers fine-tune kiye medical data pe.

**Q50. Model accuracy improve karne ke liye aur kya kar sakte the?**
> - Data augmentation (rotation, flip, zoom)
> - More training data
> - Learning rate scheduling
> - Ensemble methods (multiple models combine)
> - ResNet50 ya EfficientNet try karna
> - Class weights for imbalanced data
> - K-fold cross validation

---

# PART 4: PERSONAL EXPERIENCE QUESTIONS

## Challenges & Failures

**Q51. Project mein sabse bada challenge kya tha?**
> Grad-CAM implement karna sabse mushkil tha. VGG16 nested model tha - `model.layers[1]` ke andar tha. Simple Grad-CAM kaam nahi kiya. `GradientTape` gradients `None` return kar raha tha. Solution dhundhne mein bahut time laga - finally `tf.Variable` wrapper se fix hua.

**Q52. Kahan fail hua aur kaise recover kiya?**
> Pehle heatmap generate ho rahi thi lekin frontend pe broken image dikh rahi thi. Debug kiya toh pata chala `FileResponse` mein path issue tha - relative vs absolute path mismatch. `os.path.abspath()` se fix kiya. Aur ek bug tha - history se scan select karne pe original MRI ki jagah heatmap dikh raha tha kyunki wrong URL pass ho raha tha.

**Q53. Toggle bug kya tha aur kaise fix kiya?**
> MRI toggle OFF → ON → OFF karne pe MRI black ho jaati thi. Root cause: `useEffect` cleanup `[heatmapBlobUrl]` dependency pe tha. Jab heatmap load hoti thi, cleanup run hota tha aur `mriBlobUrl` revoke ho jaata tha. Fix: `useRef` se blob URLs track kiye, cleanup sirf component unmount pe.

**Q54. Django aur FastAPI integrate karna kyun choose kiya? Sirf ek kyun nahi?**
> FastAPI alone mein ORM, migrations, admin panel nahi hota - sab khud banana padta. Django alone mein async support limited hai aur API development slow hai. Dono ka best liya - Django ka ORM + FastAPI ki speed aur async support.

**Q55. Agar project dobara karo toh kya differently karoge?**
> - Model training mein data augmentation zaroor karta
> - Frontend mein React Query use karta API state management ke liye
> - Docker use karta deployment ke liye
> - Unit tests likhta
> - `.env` file se sab configuration manage karta
> - Absolute paths consistently use karta database mein

**Q56. Team mein kaam kiya ya akele?**
> *(Apne hisaab se answer karo)* Agar akele: "Akele kiya - isliye full stack samajhna pada. Frontend se backend tak, ML model se deployment tak sab handle kiya."

**Q57. Kitna time laga project banane mein?**
> *(Apne hisaab se answer karo)* Roughly: Model training 1-2 din, Backend setup 2-3 din, Frontend 3-4 din, Integration aur bug fixes 2-3 din.

**Q58. Sabse zyada time kahan laga?**
> Grad-CAM integration mein - nested VGG16 model ke saath gradients compute karna. Aur frontend-backend integration mein - CORS, JWT, file serving sab ek saath kaam karna.

**Q59. Kya project production ready hai?**
> Abhi nahi. Production ke liye chahiye:
> - HTTPS (SSL certificate)
> - Proper secret key management
> - Docker containerization
> - Cloud deployment (AWS/GCP)
> - Rate limiting
> - Input validation aur sanitization
> - Proper logging aur monitoring

**Q60. Is project se kya seekha?**
> Full stack development ka real experience mila. ML model ko sirf train karna kaafi nahi - usse production mein integrate karna, API banana, frontend se connect karna, security handle karna - yeh sab alag challenges hain. Explainable AI (Grad-CAM) ka importance samjha - black box model se zyada useful hai visual explanation.

---

# QUICK REFERENCE

| Topic | Key Points |
|-------|-----------|
| Model | VGG16, Transfer Learning, 4 classes, 128x128 input |
| Accuracy | ~85-90% validation |
| Grad-CAM | block5_conv3, GradientTape, tf.Variable |
| Frontend | React + TypeScript + Tailwind + Vite |
| Backend | FastAPI + Django + MySQL |
| Auth | JWT Bearer tokens |
| PDF | ReportLab, IST timezone |
| Bug Fixed | Toggle blob URL revoke, History MRI URL, Nested Grad-CAM |
