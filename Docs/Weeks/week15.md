Department of Computing
Faculty of Computing
BSCS-13E
Software Engineering SE-200
Week 15: Testing & Analytics
Fitness Tracking & Coaching System
Name Qalam Id
Laiba Riaz 464486
Muhammad Faseeh 456267
Obaid Ishtiaq Satti 464870
Moin Ud Din Abdur Rehman Azim 426112
Submitted to: Sir Sarosh Tahir
Test Plan:
The test plan for the FitPal application is designed to verify that all major functionalities of the
system are working correctly. The testing scope includes authentication (login and signup),
dashboard display, workout module, nutrition module, hydration tracking, profile management,
and navigation between different pages. The testing is performed using manual and functional
testing approaches. The tools used include Google Chrome as the web browser and Visual Studio
Code to run the application locally on http://localhost:3000. The test environment consists of
macOS and a modern web browser. The test strategy involves executing each feature using both
valid and invalid inputs to ensure proper system behavior, and screenshots are taken as evidence
of successful execution. A total of 10 test cases is designed to validate the system, and the
success criteria include correct functionality, smooth navigation, and absence of major errors or
crashes. The final deliverables include the test plan, test cases, and manual testing evidence in
the form of screenshots.
Test Cases:
Test
Case
ID
Test Case Name Steps Expected
Result
Actual Result
TC-01 Login with Valid
Credentials
Enter correct email &
password → click login
User is
redirected to
dashboard
Dashboard
opened
successfully
TC-02 Login with
Invalid
Credentials
Enter wrong
email/password → click
login
Error message
displayed
Error message
shown
TC-03 Signup
Functionality
Enter user details →
click signup
Account created
or redirected
Signup successful
TC-04 Dashboard
Display
Login → open
dashboard
Username and
stats visible
Dashboard
displayed
correctly
TC-05 Workout Module
Access
Click workout section Workout page
opens
Workout page
displayed
TC-06 Progress Tracking Open progress page Steps, calories,
weight shown
Progress
displayed
correctly
TC-07 Nutrition Module Open nutrition → select
meal
Meal plan
displayed
Meal selected
successfully
TC-08 Hydration
Tracking
Add water intake Hydration value
updated
Water intake
updated
TC-09 Profile Update Edit profile → save Updated info
saved
Profile updated
successfully
TC-10 Navigation
Between Pages
Navigate across pages All pages open
smoothly
Navigation
working correctly
Test Case 1: Login with Valid Credentials
Objective:
To verify that the user can successfully log in using valid credentials.
Steps:
1. Enter correct email and password
2. Click on login
Expected Result:
User should be redirected to the dashboard.
Actual Result:
Dashboard opened successfully.
Fill in login screen.
Logged it on correct credentials.
Test Case 2: Login with Invalid Credentials
Objective:
To verify that the system shows an error when invalid credentials are used.
Steps:
1. Enter incorrect email or password
2. Click on login
Expected Result:
An error message should be displayed.
Actual Result:
Error message shown successfully.
Fill in with wrong credentials.
Login error message.
AUTHENTICATION
FITPAL
Log in
Demo mode - credentials are stored only in this browser
(localStorage).
DEMO LOGIN
Email demo@fitpal.local
Password demo123
Fill demo credentials
Invalid email or password.
Email
demo@fitpal.locaaal
Password
Continue to dashboard
No account? Sign up
Test Case 3: Signup Functionality
Objective:
To verify that a new user can create an account successfully.
Steps:
1. Enter required user details
2. Click on signup
Expected Result:
Account should be created or user redirected.
Actual Result:
Signup completed successfully.
Sign up page.
Logged in.
Test Case 4: Dashboard Display
Objective:
To verify that the dashboard displays correct user information.
Steps:
1. Login with valid credentials
2. Open dashboard
Expected Result:
User name and statistics should be visible.
Actual Result:
Dashboard displayed correctly.
Correct credentials visible.
Test Case 5: Workout Module Access
Objective:
To verify that the workout module opens correctly.
Steps:
1. Click on workout section
Expected Result:
Workout page should open.
Actual Result:
Workout page displayed successfully.
Workout page is correctly visible.
Test Case 6: Progress Tracking
Objective:
To verify that user progress data is displayed correctly.
Steps:
1. Open progress page
Expected Result:
Steps, calories, and weight should be shown.
Actual Result:
Progress displayed correctly.
Progress page shows all the updated progress correctly.
Test Case 7: Nutrition Module
Objective:
To verify that the nutrition module displays meal plans correctly.
Steps:
1. Open nutrition section
2. Select a meal
Expected Result:
Meal plan should be displayed.
Actual Result:
Meal selected and displayed successfully.
Meal selection and display working correctly.
Test Case 8 Hydration Tracking:
Objective:
To verify that the user can log water intake and the hydration value updates correctly.
Steps:
1. Login with valid credentials
2. Navigate to Hydration section
3. Add water intake
Expected Result:
Hydration value should update accordingly.
Actual Result:
Water intake was successfully updated.
“Before adding water, hydration progress is 0%”
“After adding water, hydration progress increases”
Test Case 9 Profile Update:
Objective:
To verify that the user can update profile information.
Steps:
1. Login with valid credentials
2. Navigate to Profile page
3. Edit user details (e.g., name or weight)
4. Save changes
Expected Result:
Updated information should be saved successfully.
Actual Result:
Profile information was updated successfully.
“Initial profile shows name as Demo Athlete. After update, user information is modified
successfully.”
User wants to change name & age & weight with goal:
Test Case 10 Navigation Between Pages:
Objective:
To verify that navigation between different modules works correctly.
Steps:
1. Login with valid credentials
2. Navigate between different sections (Dashboard, Workout, Nutrition, etc.)
Expected Result:
All pages should open correctly without errors.
Actual Result:
Navigation worked smoothly across all pages.
Dashboard:
Move to workout page:
Profile Page:
Progress Page:
Nutrition:
AI-Suggestions:
Schedule:
"User successfully navigated between Dashboard, Workout, Nutrition, Profile, and other
modules without errors.”
Manual Testing:
Click on login button:
After clicking on Dashboard:
Workout page:
When we Click on Easy run, this screen opens:
Progress:
Nutrition:
Profile:
AI suggestions:
Automation Testing: Login Functionality
Objective
The objective of this automation test is to verify the login functionality of the FitPal web
application. The test ensures that a user can successfully log in using valid credentials and is
redirected to the dashboard.
Tools Used
• Selenium WebDriver
• Python
• Google Chrome Browser
Test Description
This test automates the login process of the application. It simulates real user behavior by
opening the browser, navigating to the login page, entering credentials, and submitting the form.
Test Steps
1. Open the Chrome browser using Selenium.
2. Navigate to the login page (http://localhost:3000/login).
3. Enter valid email and password.
4. Click on the login button.
5. Wait for the page to load.
6. Verify if the user is redirected to the dashboard.
Test Data
• Email: demo@fitpal.local
• Password: demo123
Expected Result
The user should be successfully logged in and redirected to the dashboard page.
Actual Result
The browser successfully opened, credentials were entered, and the application redirected to the
dashboard.
Test Outcome
Conclusion
The automation test confirms that the login functionality of the FitPal application is working
correctly. The system properly authenticates valid users and redirects them to the dashboard,
indicating successful implementation of the login feature.
Analytics Events Setup:
Tool: Firebase
Explanation:
Analytics events were configured to track specific user actions within the FitPal application.
Custom events such as login_clicked and signup_clicked were implemented to monitor
authentication-related interactions. These events are triggered when users click the respective
buttons on the login and signup pages. Additionally, events like dashboard_view track page
visits, while logout_clicked records user exit actions. Firebase Analytics automatically captures
basic events like page_view, while custom events provide deeper insights into user behavior.
This event-based tracking system enables accurate analysis of user engagement and supports
data-driven decision-making for future improvements.
Analytics Dashboard:
Tool: Firebase:
Explanation:
The Firebase Analytics Dashboard provides a real-time overview of user activity within the
FitPal application. It displays key performance indicators such as active users, user activity over
time, and geographical distribution of users. In this implementation, one active user was
recorded, with activity observed across daily, weekly, and monthly time ranges. The dashboard
also shows real-time engagement through active users per minute and identifies user location as
Pakistan. These insights confirm that analytics tracking is successfully integrated and functioning
correctly within the application.
Crash Handling Explanation:
Explanation:
Crash handling was demonstrated by intentionally triggering a runtime error using a test button
in the dashboard. When the error was triggered, the application displayed a runtime error screen,
showing details such as the error message and call stack. This helped in understanding how
crashes occur and how they can be debugged. Additionally, error handling using try-catch was
implemented to manage crashes gracefully without breaking the application. This demonstrates
the concept of crash detection and handling using Firebase Crashlytics.