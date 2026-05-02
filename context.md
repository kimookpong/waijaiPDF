# context.md

## waijaiPDF – System Context

**waijaiPDF** เป็นโมดูลสำหรับจัดการไฟล์ PDF แบบครบวงจร (PDF Processing Module) ที่ออกแบบมาเพื่อให้สามารถนำไปใช้งานซ้ำ (reusable) และต่อยอดเป็นระบบขนาดใหญ่หรือ SaaS ได้ในอนาคต โดยเน้นประสิทธิภาพ ความยืดหยุ่น และประสบการณ์ผู้ใช้ที่เรียบง่าย

---

### 1. วัตถุประสงค์ของระบบ

waijaiPDF มีเป้าหมายเพื่อให้ผู้ใช้สามารถ:

- ลดขนาดไฟล์ PDF (Compress)
- แปลงไฟล์ PDF เป็นรูปแบบอื่น (Convert)
- ประเมินและวิเคราะห์ไฟล์ก่อนดำเนินการ (Analyze)

โดยระบบจะช่วยลดความซับซ้อนในการจัดการไฟล์ PDF และเพิ่มประสิทธิภาพในการทำงานกับเอกสารดิจิทัล

---

### 2. ขอบเขตของระบบ (Scope)

#### 2.1 Compress Module

- รองรับการลดขนาดไฟล์ PDF ด้วยการปรับคุณภาพของภาพและโครงสร้างไฟล์
- รองรับการควบคุมระดับการบีบอัดผ่าน slider (0–100)
- แสดงขนาดไฟล์โดยประมาณหลังการบีบอัด (Estimated Output Size)
- รองรับการตั้งค่าเพิ่มเติม เช่น target file size

#### 2.2 Convert Module

- รองรับการแปลงไฟล์ PDF ไปยัง:
  - DOCX
  - JPG / PNG
  - TXT (ผ่าน OCR)
  - HTML

- รองรับทั้งไฟล์ที่เป็น text และ scanned document

#### 2.3 Analyze Module

- ตรวจสอบคุณสมบัติของไฟล์ เช่น:
  - จำนวนหน้า
  - ประเภทไฟล์ (text-based / image-based)
  - ขนาดไฟล์

- ใช้สำหรับ:
  - แนะนำ action ที่เหมาะสม
  - ประเมินผลลัพธ์ของการ compress

---

### 3. System Flow

```text
Upload File
   ↓
Analyze File
   ↓
Suggest Action (Compress / Convert)
   ↓
User Select Option
   ↓
Process (Compress / Convert)
   ↓
Return Result
```

---

### 4. สถาปัตยกรรมระบบ (Architecture)

waijaiPDF ถูกออกแบบเป็น modular architecture โดยแบ่งเป็น:

- **API Layer**
  - รับ request จาก client
  - จัดการ routing และ validation

- **Core Engine**
  - ทำหน้าที่เป็น abstraction layer สำหรับ PDF processing
  - เรียกใช้ tools ภายนอก

- **Processing Modules**
  - Compress Module
  - Convert Module
  - Analyze Module

- **Queue System (Optional)**
  - รองรับงานที่ใช้เวลานาน
  - เพิ่ม scalability ของระบบ

- **Storage Layer**
  - จัดเก็บไฟล์ input/output ชั่วคราวหรือถาวร

---

### 5. แนวทางการออกแบบ (Design Principles)

- **Modular Design**
  แยกแต่ละความสามารถออกเป็น module ชัดเจน

- **Scalability**
  รองรับการทำงานแบบ asynchronous และ horizontal scaling

- **Extensibility**
  สามารถเพิ่ม format หรือ feature ใหม่ได้ง่าย

- **User-Centric UX**
  เริ่มจากการ upload ไฟล์ → วิเคราะห์ → แนะนำ → ให้ผู้ใช้เลือก

---

### 6. ประสบการณ์ผู้ใช้ (User Experience)

- ผู้ใช้เริ่มจากการ upload ไฟล์
- ระบบวิเคราะห์ไฟล์อัตโนมัติ
- แสดงตัวเลือก:
  - Compress (พร้อม slider)
  - Convert (เลือก format)

- แสดงข้อมูล:
  - ขนาดไฟล์เดิม
  - ขนาดโดยประมาณหลัง compress

- ดาวน์โหลดผลลัพธ์ได้ทันที

---

### 7. ข้อจำกัดของระบบ

- การประเมินขนาดไฟล์หลัง compress เป็นเพียงค่าประมาณ
- การแปลงไฟล์บาง format อาจไม่สมบูรณ์ 100%
- ประสิทธิภาพขึ้นอยู่กับลักษณะของไฟล์ PDF

---

### 8. การต่อยอดในอนาคต

- รองรับ batch processing
- เพิ่ม feature preview ก่อนดาวน์โหลด
- รองรับ watermark และ encryption
- พัฒนาเป็น SaaS platform เต็มรูปแบบ

---

**waijaiPDF** ถูกออกแบบมาเพื่อเป็นรากฐานของระบบจัดการ PDF ที่สามารถพัฒนาและขยายต่อได้ในระยะยาว โดยเน้นทั้งประสิทธิภาพของระบบและความง่ายในการใช้งานของผู้ใช้
