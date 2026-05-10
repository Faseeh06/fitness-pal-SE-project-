Department of Computing
Faculty of Computing
BSCS-13E
Software Engineering SE-200
SRS & Use Cases
Name Qalam Id
Laiba Riaz 464486
Muhammad Faseeh 456267
Obaid Ishtiaq Satti 464870
Moin Ud Din Abdur Rehman Azim 426112
Submitted to: Sir Sarosh Tahir
1. Functional Requirements:
ID Functional
Requirement
Description
FR-01 User Registration The system shall allow users to create an account using email
and password.
FR-02 User Login The system shall allow registered users to log in securely.
FR-03 User Logout The system shall allow users to log out of their account.
FR-04 Profile Management The system shall allow users to create, update, and view their
profile (age, weight, height, goals).
FR-05 Step Tracking The system shall track and display the user’s daily step count in
real-time or through manual input.
FR-06 Calorie Tracking The system shall allow users to track calories burned through
activities.
FR-07 Workout Plan Generation The system shall provide personalized workout plans based on
user goals.
FR-08 Diet Plan
Recommendation
The system shall suggest diet plans based on user profile and
goals.
FR-09 Progress Tracking The system shall display progress reports (daily, weekly,
monthly).
FR-10 Goal Setting The system shall allow users to set and update fitness goals.
FR-11 Notifications The system shall send scheduled notifications and reminders for
workouts, diet plans, and daily activities.
FR-12 Admin Management The system shall allow admin to manage users and system data.
FR-13 Trainer Panel The system shall allow trainers to create and manage
workout/diet plans.
FR-14 Data Storage The system shall securely store user data including profile,
activity, and progress information in a database.
FR-15 Dashboard View The system shall provide a dashboard showing user activity
summary.
2. Non-Functional Requirements:
ID Requirement Description
NFR-01 Usability The system should provide a simple and intuitive user interface that
can be used by beginners without training.
NFR-02 Performance The system should respond to user actions within 2 seconds.
NFR-03 Security The system should protect user data using secure authentication.
NFR-04 Availability The system should be available at least 99% of the time excluding
maintenance periods.
NFR-05 Scalability The system should handle increasing number of users efficiently.
NFR-06 Reliability The system should perform consistently without crashes.
NFR-07 Compatibility The system should work on different devices (mobile/web).
NFR-08 Maintainability The system should be easy to update and maintain.
3. Assumptions:
• It is assumed that users will enter correct personal data such as age, weight, height, and
fitness goals, which will be used to generate personalized plans.
• It is assumed that users will regularly interact with the system (log workouts, steps, and
diet) for accurate progress tracking.
• It is assumed that the system will either use built in device sensors or manual input for
step and activity tracking.
• It is assumed that trainers (if included) will provide valid and structured workout and diet
plans through the system.
• It is assumed that users have basic knowledge of using mobile applications and can
navigate the app interface easily.
• It is assumed that internet connectivity will be available for features such as data
synchronization, updates, and notifications.
4. Constraints:
• The project must be completed within the academic timeline (Week 11 to Week 16), which
limits the implementation of advanced features.
• The system may initially be developed only as a prototype (Figma or basic app), so full real
time tracking and integrations may not be implemented.
• Integration with external devices (e.g., smartwatches or fitness bands) may not be fully
supported due to technical limitations.
• The system may rely on manual data entry for some features (e.g., calorie tracking) due to lack
of real-time sensor integration.
• Limited team size and development experience may restrict the complexity of features such as
AI-based recommendations.
• Data privacy and security measures will be basic at the prototype stage and may not meet full
industry-level standards conditions.
5. Use Cases:
Use Case 1:
Name:
User Registration
Actor:
User
Description:
This use case allows a new user to create an account in the system by providing required
personal and login details.
Preconditions:
• User must not already have an account
• User must have internet access
Postconditions:
• User account is successfully created
• User data is stored in the system database
Main Flow (Normal Flow):
1. User opens the application
2. User selects “Sign Up” option
3. System displays registration form
4. User enters required details (email, password, age, weight, height, fitness goals)
5. User submits the form
6. System validates the input data
7. System creates a new user account
8. System stores user information in the database
9. System displays success message
10. User is redirected to dashboard or login screen
Alternate Flow:
• A1: Invalid Input
• If user enters invalid or incomplete data
• System displays error message
• User is prompted to correct the input
• A2: Existing Account
• If email is already registered
• System shows “Account already exists” message
Use Case 2:
Name:
Track Workout
Actor:
User
Description:
This use case allows users to log their daily workouts or physical activities to monitor progress.
Preconditions:
• User must be logged in
Postconditions:
• Workout data is saved
• User progress is updated
Main Flow (Normal Flow):
1. User logs into the system
2. User navigates to “Activity Tracking” section
3. User selects “Add Workout”
4. System displays workout input form
5. User enters workout details (type, duration, calories burned)
6. User submits the workout
7. System validates the input
8. System stores workout data in database
9. System updates user progress dashboard
10. System confirms successful entry
Alternate Flow:
• A1: Missing Data
• If required fields are empty
• System displays error message
• User is asked to complete missing fields
• A2: Manual vs Auto Tracking
• If device integration is unavailable
• User manually enters workout data
Use Case 3:
Name:
Generate Workout & Diet Plan
Actor:
System (Primary), User (Secondary)
Description:
This use case generates a personalized workout and diet plan based on user profile and fitness
goals.
Preconditions:
• User must be logged in
• User profile must be completed (age, weight, goals, etc.)
Postconditions:
• Personalized plan is generated and displayed
• Plan is stored for future reference
Main Flow (Normal Flow):
1. User logs into the system
2. User navigates to “Plans” section
3. User requests a personalized plan
4. System retrieves user profile data
5. System analyzes user goals and fitness level
6. System generates customized workout plan
7. System generates corresponding diet recommendations
8. System displays the complete plan to the user
9. System saves the plan in user history
Alternate Flow:
• A1: Incomplete Profile
• If user profile data is missing
• System prompts user to complete profile first
• A2: Plan Update
• If user progress changes
• System regenerates updated plan
Use Case 4:
Name:
Track Calories & Diet
Actor:
User
Description:
This use case allows users to log their daily food intake and monitor calorie consumption to
support their nutrition goals.
Preconditions:
• User must be logged in
• User profile must have a calorie goal set
Postconditions:
• Food intake is saved
• Daily calorie count is updated
• Nutritional summary is reflected on dashboard
Main Flow (Normal Flow):
1. User logs into the system
2. User navigates to "Diet Tracking" section
3. User selects "Log Meal"
4. System displays food search interface
5. User searches for food item or scans barcode
6. System retrieves nutritional data for selected item
7. User confirms portion size and meal type (breakfast, lunch, dinner, snack)
8. User submits the entry
9. System stores the food log in the database
10. System updates the daily calorie and nutrition summary
Alternate Flow:
• A1: Food Item Not Found
o If the searched item is not in the database
o System prompts user to enter nutritional details manually
o User inputs calories and macros manually
o System saves the custom entry
• A2: Daily Calorie Goal Exceeded
o If logged intake exceeds the set calorie goal
o System displays a warning notification
o User is advised to adjust remaining meals
Use Case 5:
Name:
View Progress Report
Actor:
User
Description:
This use case allows users to view their fitness progress over time through visual dashboards
showing workout history, calorie trends, step counts, and goal completion.
Preconditions:
• User must be logged in
• At least one activity or diet entry must exist in the system
Postconditions:
• Progress data is displayed to the user
• No data is modified; this is a read-only operation
Main Flow (Normal Flow):
1. User logs into the system
2. User navigates to "Progress" section
3. User selects desired time range (daily, weekly, monthly)
4. System retrieves relevant activity, calorie, and workout data
5. System processes and aggregates the data
6. System displays progress charts and statistics
7. User reviews milestone completions and trends
8. User can optionally export the report
Alternate Flow:
• A1: No Data Available
o If no entries exist for the selected time range
o System displays "No data found" message
o System suggests user log activities to start tracking
• A2: Partial Data
o If only some categories have entries (e.g., workouts logged but no diet)
o System displays available data only
o System highlights missing tracking areas with a prompt to complete them
Use Case Diagram:
The use case diagram represents the functional scope of the Fitness Tracking & Coaching App. It
identifies four actors: the User, System, Trainer, and Admin. The User is the primary actor and
interacts with the core features of the application including account registration, workout
tracking, calorie and diet tracking, personalized plan generation, progress reporting, and profile
management. The Trainer actor manages the trainer panel, handling workout and diet plan
creation for users. The Admin actor oversees the admin panel, managing users and monitoring
overall system activity. The System acts as a secondary actor that automatically triggers the plan
generation process based on user data.
Figma Design :
For our project, we’re using Light and minimalistic UI.
Login Page:
Dashboard:
Link:
https://www.figma.com/design/T2t6mZHecu8DZpP12K1cCX/Untitled?node-id=0-
1&t=vFAggYG1b2uKyQwQ-1