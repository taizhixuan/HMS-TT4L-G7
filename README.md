# Hospital Management System — Automated Testing (Cypress)

**Course:** CSE6324 Software Verification & Validation
**Assignment 2 — Group 7 (TT4L)**
**System under test:** [Hospital Management System](https://github.com/kishan0725/Hospital-Management-System) (PHP + MySQL)

This bundle contains the **Cypress** end-to-end automation scripts that execute the
test cases designed in our **Report 2 — Test Cases** following the
steps in **Report 3 — Test Procedure Specification**.

It automates **48 of the 52 documented test cases**. The remaining 4
(TC-04-012/013/014/015 — appointment cancellation, prescription creation, bill
generation) are **manual** per HMS_TCS because each spans the patient, doctor
and billing roles within one procedure.

---

## 1. Coverage at a glance

| Feature | Spec file | Tests | Report 3 procedure |
|---|---|---|---|
| F001 Patient Registration | `e2e/01_registration.cy.js` | 12 | TP-01-001 … 004 |
| F002 Patient Login | `e2e/02_patient-login.cy.js` | 8 | TP-02-001 … 004 |
| F003 Doctor Login | `e2e/03_doctor-login.cy.js` | 8 | TP-03-001 … 004 |
| F005 Appointment Booking | `e2e/04_appointment.cy.js` | 15 | TP-04-001 … 006 |
| REQ_UI004 Dashboard Navigation | `e2e/05_dashboard.cy.js` | 2 | TP-05 |
| REQ_UI007 UI Interaction | `e2e/06_ui-interaction.cy.js` | 3 | TP-06 |
| **Total** | | **48** | |

Every `it()` block is named with its **TC-ID** (e.g. `TC-01-007`), so each automated
test traces directly back to a case in Report 2 and a procedure in Report 3.

The test-design techniques applied: **Boundary Value Analysis**, **Equivalence
Partitioning**, **State Transition**, **Decision Table**, plus use-case **Main /
Alternate / Exception** flows.

---

## 2. Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 18 or newer | `node --version` |
| npm | (bundled with Node) | `npm --version` |
| Google Chrome | latest stable | used for the test run |
| XAMPP | any recent | provides Apache + MySQL |

> **Database port:** the test-helper endpoint connects to MySQL on **port 3307**.
> If your MySQL runs on the default 3306, update the port in `_test_helpers.php`.

---

## 3. Setup

1. Deploy the Hospital Management System under XAMPP and import its database, so it
   is reachable at `http://localhost/Hospital-Management-System/`.

2. Place the testing files into the project root and merge:

   ```
   C:\xampp\htdocs\Hospital-Management-System\
   ├── (existing HMS PHP files)
   ├── package.json            ← from this bundle
   ├── cypress.config.js       ← from this bundle
   ├── _test_helpers.php       ← from this bundle
   └── cypress\                ← from this bundle
       ├── e2e\                (the 6 spec files)
       ├── fixtures\           (test-data.json)
       └── support\            (custom commands)
   ```

3. Install Cypress:

   ```powershell
   cd C:\xampp\htdocs\Hospital-Management-System
   npm install
   npx cypress verify        # expect: "Verified Cypress!"
   ```

4. Confirm the helper can reach the database:

   ```powershell
   curl "http://localhost/Hospital-Management-System/_test_helpers.php?action=ping"
   ```

   Expected: `{"ok":true,"action":"ping","changes":[],"db":"reachable"}`
   If you see `db_connect_failed`, fix the MySQL port (see Prerequisites).

---

## 4. Running the tests

**Interactive (Cypress GUI):**
```powershell
npm run cypress:open
```
Choose **E2E Testing → Chrome → Start E2E Testing**, then click a spec to watch it run.

**Headless (full suite):**
```powershell
npm run cypress:run
```

**Single feature:**
```powershell
npm run test:registration       # F001 (12 tests)
npm run test:patient-login      # F002 (8 tests)
npm run test:doctor-login       # F003 (8 tests)
npm run test:appointment        # F005 (15 tests)
npm run test:dashboard          # REQ_UI004 (2 tests)
npm run test:ui                 # REQ_UI007 (3 tests)
```

A headless run regenerates `cypress/videos/` (one MP4 per spec) and, on failure,
`cypress/screenshots/`. These are run artifacts and are **not** part of the
submitted source.

---

## 5. Bundle contents

| File | Purpose |
|---|---|
| `package.json` | Cypress dev-dependency and npm run scripts |
| `cypress.config.js` | Base URL, viewport, timeouts, video, retries |
| `_test_helpers.php` | DB seed/reset endpoint (called by `cy.hmsReset()`) |
| `cypress/support/e2e.js` | Global setup; ignores benign jQuery/Bootstrap exceptions |
| `cypress/support/commands.js` | Shared custom commands (`hmsReset`, `fillRegistration`, `loginAsDoctor`, `bookAppointment`, `captureAlerts`, …) |
| `cypress/fixtures/test-data.json` | Central test data (sample patient/doctor, boundary contact values, time slots) |
| `cypress/e2e/*.cy.js` | The six feature spec files (see §1) |

---

## 6. Notes for the reviewer

A few of the tests are written to **fail against the current HMS on purpose** — they
assert the *correct* behaviour and so reveal genuine defects in the system under
test (not faults in the test scripts):

1. **Empty contact accepted** — the registration form sets `minlength`/`maxlength="10"`
   but omits `required`, so a blank contact submits. `TC-01-006` expects rejection.
2. **No server-side length check** — contact length is only constrained client-side by
   `maxlength`; with that removed, 11-digit input is accepted. `TC-01-003 / 008 / 012`
   expect rejection.
3. **Blocking `alert()` on login failure** — handled in the tests via `cy.captureAlerts()`.

These differences are intentional and are reported as findings in our results.

---

# Hospital Management System
Hospital Management System using MySQL, Php and Bootstrap


Video Demo : [Hospital Management System - Youtube](https://www.youtube.com/watch?v=W2XGSM5i9P8)

Live Demo : [Hospital Management System - 000webhost by Kishan](https://kishan0725.000webhostapp.com)

## Need to work on:

1. Ability to accept the appointment by the doctor to acknowledge the patient that their appointment has been approved.
2. User should not be allowed to register if he/she tries to provide the already registered email ID.
3. The password should be encrypted and the password field shouldn't be displayed in the admin panel.
4. Implementation of pagination for all the list view across the application.
5. Bug fix - Bill payment receipt contains multiple record if the patient has associated with the same doctor multiple times.
6. Addition of more fields in the prescription statement to make it more specific one.
7. Addition of more details on payment - such as date of the payment made, amount paid, etc.
8. Implementation of export button in admin module to export all details to an excel sheet.

## Prerequisites
1. Install XAMPP web server
2. Any Editor (Preferably VS Code or Sublime Text)
3. Any web browser with latest version

## Languages and Technologies used
1. HTML5/CSS3
2. JavaScript (to create dynamically updating content)
3. Bootstrap (An HTML, CSS, and JS library)
4. XAMPP (A web server by Apache Friends)
5. Php
6. MySQL (An RDBMS that uses SQL)
7. TCPDF (to generate PDFs)

## Steps to run the project in your machine
1. Download and install XAMPP in your machine
2. Clone or download the repository
3. Extract all the files and move it to the 'htdocs' folder of your XAMPP directory.
4. Start the Apache and Mysql in your XAMPP control panel.
5. Open your web browser and type 'localhost/phpmyadmin'
6. In phpmyadmin page, create a new database from the left panel and name it as 'myhmsdb'
7. Import the file 'myhmsdb.sql' inside your newly created database and click ok.
8. Open a new tab and type 'localhost/foldername' in the url of your browser
9. Hurray! That's it!
    
### SOFTWARES USED
  - XAMPP was installed on the Ubuntu 19.04 machine and APACHE2 Server and MySQL were initialized. And, files were built inside opt/lampp/htdocs/myhmsp
  - Sublime Text 3.2 was used as a text editor.
  - Google Chrome Version 77.0.3865.90 was used to run the project (localhost/myhmsp was used as the url).
  

### Starting Apache And MySQL in XAMPP:
  The XAMPP Control Panel allows you to manually start and stop Apache and MySQL. To start Apache or MySQL manually, click the ‘Start’ button under ‘Actions’.
  
  
<p align="center"><img src="https://user-images.githubusercontent.com/36665975/59350977-fcc68900-8d3a-11e9-9450-e5c478497caa.png"></img></p>

## GETTING INTO THE PROJECT:
Hospital Management System in php and mysql. This system has a ‘Home’ page from where the patient, doctor & administrator can login into their accounts by toggling the tabs accordingly. Fig 1.1 shows the ‘Home’ page of our project.

![image](https://user-images.githubusercontent.com/36665975/66569676-ad2d8800-eb89-11e9-94e5-ea407622a1fe.png)

'About Us' page (Fig 1.2)  allows us to get some more information about the quality and the services of the hospital.

![image](https://user-images.githubusercontent.com/36665975/66569816-f4b41400-eb89-11e9-9377-d9ce53ded088.png)

‘Contact’ page allows users to provide feedback or queries about the services of the hospital. Fig 1.3 shows the ‘Contact’ page.

![image](https://user-images.githubusercontent.com/36665975/66569890-157c6980-eb8a-11e9-9b2f-c0e8a6ef702e.png)

The ‘Home’ page consists of 3 modules:
1. Patient Module
2. Doctor Module
3. Admin Module

### Patient Module:

  &nbsp; &nbsp; &nbsp; This module allows patients to create their account, book an appointment to see a doctor and see their appointment history.
  The registration page(in the home page itself) asks patients to enter their First Name, Last Name, Email ID, Contact Number, Password and radio buttons to select their gender.
  
  ![image](https://user-images.githubusercontent.com/36665975/66570027-5b393200-eb8a-11e9-9e97-088630b5e583.png)

Once the patient has created his/her own account after clicking the ‘Register’ button, then he will be redirected to his/her Dashboard(Fig 1.5).

![image](https://user-images.githubusercontent.com/36665975/66570123-8c196700-eb8a-11e9-845f-ea02013f1d5c.png)

The Dashboard page allows patients to perform two operations:

**1. Book his/her appointment:**

  &nbsp; &nbsp; &nbsp; Here, the patients can able to book their appointments to see a doctor. The appointment form(Fig 1.6) requires patients to select the doctor that they want to see, Date and Time that they want to meet with the doctor. The consultancy fee will be shown accordingly to the patient as it was already determined by the doctor.

![image](https://user-images.githubusercontent.com/36665975/66570202-c256e680-eb8a-11e9-8839-6c7fef68ac4c.png)

After clicking on the ‘Create new entry’ button, the patient will receive an alert that acknowledges the successful appointment of the patient.(See Fig 1.7) 

![image](https://user-images.githubusercontent.com/36665975/66570280-ec100d80-eb8a-11e9-96c2-08e5441954d0.png)

**2. View patients’ Appointment History:**

  &nbsp; &nbsp; &nbsp; Here, the patient can see their appointment history which contains Doctor Name, Consultancy Fee, Appointment Date and Time.(See Fig 1.8).
	
![image](https://user-images.githubusercontent.com/36665975/66570349-0ea22680-eb8b-11e9-94fe-22a86070a274.png)

Once the patient has logged out of his account, if he wants to go into his account again, he can login his account, instead of register his account again. Fig 1.9 shows the login page.
Clicking on ‘Login’ button will redirect the patient to his dashboard page which we have seen earlier (Fig 1.5)

![image](https://user-images.githubusercontent.com/36665975/66570502-588b0c80-eb8b-11e9-88e3-5294ae896ace.png)

This is how the patient module works. On the whole, this module allows patients to register their account or login their account(if he/she has one), book an appointment and view his/her appointment history.

### Doctor Module:

  &nbsp; &nbsp; &nbsp; The doctors can login into their account which can be done by toggling the tab from ‘Patient’ to ‘Doctor’. Fig 1.10 shows the login form for a doctor. Registration of a doctor account can be done only by admin. We will discuss more about this in Admin Module.
  
![image](https://user-images.githubusercontent.com/36665975/66570609-8bcd9b80-eb8b-11e9-8099-9f285aa7fe0f.png)

Once the doctor clicking the ‘Login’ button, they will be redirected to their own dashboard which is shown in Fig 1.11

![image](https://user-images.githubusercontent.com/36665975/66570642-a0119880-eb8b-11e9-8d23-be898e1bfa29.png)

In this page, doctor can able to see their appointments which has been booked by the patients. Fig 1.12 shows the appointment of the doctor ‘Ganesh’ which has been booked by the patient ‘Kenny Sebastian’ (Fig 1.6). This means that the doctor ‘Ganesh’ will have an appointment with the patient ‘Kenny Sebastian’ on 10-10-2019 10AM. 

![image](https://user-images.githubusercontent.com/36665975/66570704-be779400-eb8b-11e9-92ae-21d8e0e4aba4.png)

In real-time, the doctors will have thousands of appointments. It will be easier for a doctor to search for appointment in the case of more appointments. To make it easier, I have a ‘Search’ box in the navigation bar (See Fig 1.12) which allows doctors to search for a patient by their contact number.
&nbsp; &nbsp; &nbsp; Once everything is done, the doctor can logout of their account. Thus, in general, a doctor can login into his/her account, view their appointments and search for a patient. This is all about Doctor Module.

### Admin Module:
   
   &nbsp; &nbsp; &nbsp; This module is the heart of our project where an admin can see the list of all patients. Doctors and appointments and the feedback/queries received from the ‘Contact’ page. Also admin can add doctor too. 
  &nbsp; &nbsp; &nbsp; Login into admin account can be done by toggling into admin tab of the Home page. Fig 1.13 shows the login page for admin.
  &nbsp; &nbsp; &nbsp; `username`: admin, `password`: admin123

![image](https://user-images.githubusercontent.com/36665975/66570795-e961e800-eb8b-11e9-94e2-79940ff1d45e.png)

On clicking the ‘Login’ button, the admin will be redirected to his/her dashboard as shown in 
Fig 1.14.

![image](https://user-images.githubusercontent.com/36665975/66570841-03032f80-eb8c-11e9-9cfc-62b6b869c918.png)

This module allows admin to perform five major operations:

**1. View the list of all patients registered:**

  &nbsp; &nbsp; &nbsp; Admin can able to view all the patients registered. This includes the patients’ First Name, Last Name, Email ID, Contact Number and Password. (See Fig 1.15).As like in doctor module, admin can also search for a patient by their contact number in the search box.
  
  ![image](https://user-images.githubusercontent.com/36665975/66571179-83c22b80-eb8c-11e9-8819-008cdd2b0c2e.png)
  
**2. View the list of all doctors registered:**

  &nbsp; &nbsp; &nbsp; Details of the doctors can also be viewed by the admin. This details include the Name of the doctor, Password, Email and Consultancy fees, shown in Fig 1.16. Searching for a doctor can be done by using the doctor’s Email ID in the search box.

![image](https://user-images.githubusercontent.com/36665975/66571329-a5bbae00-eb8c-11e9-89be-ce1a9c73e01b.png)

**3. View the Appointment lists:**

  &nbsp; &nbsp; &nbsp; Admin can also able to see the entire details of the appointment that shows the appointment details of the patients with their respective doctors. This includes the First Name, Last Name, Email and Contact Number of patients, doctor’s name, Appointment Date, Time and the Consultancy Fees. (See Fig 1.17). 
  
  ![image](https://user-images.githubusercontent.com/36665975/66571377-c3891300-eb8c-11e9-92d2-6755204564c7.png)
  
**4. Add Doctor:**

  &nbsp; &nbsp; &nbsp; Admin alone can add a new doctor since anyone can register as a doctor if we put this section on the home page. This form asks Doctor’s Name, Email ID, Password and his/her Consultancy Fees.(See Fig 1.18)
  
  ![image](https://user-images.githubusercontent.com/36665975/66571687-55911b80-eb8d-11e9-9859-54e15d4ad8a0.png)
  
  After adding a new doctor, if we check the doctor’s list, we will see the details of new doctor is added to the list as shown in the Fig 1.19
  
  ![image](https://user-images.githubusercontent.com/36665975/66571496-03e89100-eb8d-11e9-954e-7e3704bd0ca3.png)
  
**5. View User’s feedback/Queries:**

  &nbsp; &nbsp; &nbsp; Admin is allowed to view the feedback/Query that has been given by the user in the ‘Contact’ page (Refer Fig 1.3). This includes User’s Name, Email Id, Contact Number and the message(Feedback/ Query) as shown in the Fig 1.20.
  
  ![image](https://user-images.githubusercontent.com/36665975/66571573-27134080-eb8d-11e9-8c1f-191a9f491872.png)
  
  &nbsp; &nbsp; &nbsp; Taking everything into consideration, admin can able to view the details of patients and doctors, appointment details, Feedback by the user and can add a new doctor. Once everything is done, the admin can logout from his account.

## Updates

### 1. Cancel Appointments
	
   &nbsp; &nbsp; &nbsp; Patients and doctors can able to delete their appointments.
 
   ![image](https://user-images.githubusercontent.com/36665975/75169587-d0c72880-574e-11ea-9a9e-ba098c04e594.png)
    
  If the patient deletes the last record (for doctor Ganesh), then a label "deleted by you" will be displayed in the column 'Current Status' and the action will change to cancel state.
  
  ![image](https://user-images.githubusercontent.com/36665975/75169873-47642600-574f-11ea-8ca4-420b0dfd20c3.png)
  
  Now if we login to the doctor Ganesh's account and view his appointment details, then it will look like this:
  
  ![image](https://user-images.githubusercontent.com/36665975/75170076-9316cf80-574f-11ea-84ff-6a5976ce8179.png)
  
  Similarly doctors can also delete their appointments and patients can view their updated appointment details.
  
### 2. Remove Doctors by Admin

&nbsp; &nbsp; &nbsp; Admin can also delete the doctors from the system. This let admin to have more control over the system.

![image](https://user-images.githubusercontent.com/36665975/75170650-6d3dfa80-5750-11ea-8f05-455c7d704217.png)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=kishan0725/Hospital-Management-System&type=Timeline)](https://star-history.com/#kishan0725/Hospital-Management-System&Timeline)
  




