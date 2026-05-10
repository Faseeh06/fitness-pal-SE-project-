Department of Computing
Faculty of Computing
BSCS-13E
Software Engineering SE-200
Week 14: Architecture & Design
Fitness Tracking & Coaching System
Name Qalam Id
Laiba Riaz 464486
Muhammad Faseeh 456267
Obaid Ishtiaq Satti 464870
Moin Ud Din Abdur Rehman Azim 426112
Submitted to: Sir Sarosh Tahir
Architecture Design:
This shows a 3-Tier Architecture + Services Layer:
• Presentation Layer (Frontend)
• Application Layer (Backend APIs)
• Data Layer (Database)
• Service Modules
Architecture Explanation:
The Fitness Tracking & Coaching System follows a multi-layered architecture to ensure
scalability, maintainability, and clear separation of concerns.
1. Presentation Layer (Frontend)
This layer includes:
• User Mobile/Web Application
• Trainer Panel
• Admin Panel
It is responsible for:
• Displaying UI (dashboard, plans, progress)
• Taking user input (workouts, diet, goals)
• Sending requests to backend APIs
This layer ensures a simple and user-friendly interface, as required in usability requirements .
2. Application Layer (Backend Server)
The backend acts as the core processing unit of the system.
Responsibilities:
• Handling API requests
• Processing user data
• Applying business logic
• Connecting frontend with database
3. Service Layer (Core Functional Modules)
The system is divided into specialized services:
• Authentication Service
• Manages login, registration, and security
• Ensures secure access to the system
• Workout & Diet Engine
• Generates personalized plans
• Uses user profile and goals
• Progress Tracking Service
• Tracks steps, calories, workouts
• Updates dashboards and reports
• Notification Service
• Sends reminders and alerts
• Improves user consistency
4. Data Layer (Database)
The database stores:
• User profiles
• Workout and diet data
• Progress records
• Plans and goals
It ensures:
• Data persistence
• Fast retrieval
• Secure storage
5. External Integrations (Optional)
The system may integrate with:
• Wearable devices (step tracking)
• Food databases (calorie tracking)
This enhances automation and reduces manual input.
Architecture Style Justification
This system uses a Layered Architecture with modular services because:
• It separates UI, logic, and data clearly
• It supports scalability for future features
• It allows independent development of modules
• It improves maintainability and testing
Module/Component Design:
Based on the 3-Tier Architecture and Service Layers provided in the design brief, the system is
divided into the following core modules to ensure clear separation of concerns:
1. User & Authentication Module
Components:
• Auth Controller
• Profile Manager
• Onboarding Engine
Responsibilities:
• Handles secure authentication (Email/Password, Google, Apple SSO).
• Manages user onboarding to collect physical attributes (Age, Weight, Height, Gender).
• Stores fitness goals and physical activity levels.
2. Workout Management Module
Components:
• Workout Strategy Engine
• Plan Generator
• Exercise Library
• Video Streamer
Responsibilities:
• Utilizes the Strategy Pattern to generate personalized weekly workout schedules (e.g.,
Weight Loss vs. Muscle Gain).
• Provides structured workout days with specific exercises, sets, reps, and rest times.
• Serves instructional workout videos and articles to the user.
3. Nutrition & Diet Module
Components:
• Diet Engine
• Meal Planner
• Recipe Database
Responsibilities:
• Creates customized meal plans based on dietary preferences (e.g., Keto, Vegetarian),
allergies, cooking time, and caloric goals.
• Provides macronutrient breakdowns (Protein, Carbs, Fats) and step-by-step recipe
instructions.
4. Progress Tracking & Analytics Module
Components:
• Dashboard Facade
• Activity Logger (Steps, Hydration, Sleep)
• Statistics Engine
Responsibilities:
• Utilizes the Observer Pattern to update goal statuses based on daily inputs.
• Aggregates daily logs to update progress charts and weekly statistics.
• Tracks steps, water intake, sleep duration, and calorie expenditure against targets.
5. Virtual Assistant Module
Components:
• Chat Interface
• Query Handler
Responsibilities:
• Provides a conversational interface (Chatbot) to help users troubleshoot, navigate the app,
and view their history.
6. Notification Service Module
Components:
• Reminder Engine
• Push Notifications
Responsibilities:
• Sends user-configured alerts and reminders for workouts, meals, and hydration.
Database Design:
1. Users
Field Name Data Type Constraints / Description
user_id INT Primary Key, Auto Increment
full_name VARCHAR Not Null
email VARCHAR Unique, Not Null
password_hash VARCHAR Not Null
auth_provider ENUM ('email', 'google', 'apple')
created_at TIMESTAMP Default: Current Timestamp
2. UserProfiles
Field Name Data Type Constraints / Description
profile_id INT Primary Key, Auto Increment
user_id INT Foreign Key → Users.user_id
gender ENUM ('Male', 'Female', 'Other')
age INT
weight_kg FLOAT
height_cm FLOAT
goal_type VARCHAR
activity_level ENUM ('Beginner', 'Intermediate', 'Advanced')
3. WorkoutPlans
Field Name Data Type Constraints / Description
plan_id INT Primary Key, Auto Increment
user_id INT Foreign Key → Users.user_id
strategy_used VARCHAR
start_date DATE
end_date DATE
4. Workouts
Field Name Data Type Constraints / Description
workout_id INT Primary Key, Auto Increment
plan_id INT Foreign Key → WorkoutPlans.plan_id
day_of_week VARCHAR
workout_name VARCHAR
duration_minutes INT
estimated_calories_burn INT
5. MealPlans
Field Name Data Type Constraints / Description
meal_plan_id INT Primary Key, Auto Increment
user_id INT Foreign Key → Users.user_id
caloric_goal INT
dietary_preference VARCHAR
allergies VARCHAR
cooking_time_pref_mins INT
6. Meals
Field Name Data Type Constraints / Description
meal_id INT Primary Key, Auto Increment
meal_plan_id INT Foreign Key → MealPlans.meal_plan_id
meal_type ENUM ('Breakfast', 'Lunch', 'Dinner', 'Snack')
meal_name VARCHAR
calories INT
protein_g INT
carbs_g INT
fat_g INT
recipe_instructions TEXT
7. DailyProgress
Field Name Data Type Constraints / Description
log_id INT Primary Key, Auto Increment
user_id INT Foreign Key → Users.user_id
date DATE
steps_taken INT
water_ml INT
sleep_hours FLOAT
calories_consumed INT
calories_burned INT
Design Patterns (Bonus Task):
For a thorough understanding of the following design patterns, it is advised to check the
class diagram from the previous week.
1. Strategy Pattern (For Plan Generation)
Since both a Trainer and potentially the system (via WorkoutPlan/DietPlan) create plans,
the Strategy Pattern allows you to swap algorithms (e.g., "Weight Loss Strategy" vs.
"Muscle Gain Strategy") without changing the classes.
Implementation: WorkoutPlan and DietPlan act as contexts. The generatePlan() method
delegates the logic to a specific Strategy object based on the User goals.
2. Observer Pattern (For Progress Tracking)
Since a User has a 1-to-many relationship with Progress, the Observer pattern is perfect
for updating the Goal status whenever new progress is logged.
Implementation: The Progress class acts as the Subject. When trackProgress() is called,
it notifies the Goal class to update the remaining targetWeight or dailySteps.
3. Factory Method (For User/Admin/Trainer Creation)
Since you have different types of users (User, Trainer, Admin) with varying attributes and
permissions, a Factory Method centralizes the instantiation logic.
Implementation: A UserFactory class with a createUser(type) method that returns the
specific object, ensuring the correct IDs and roles are assigned.
4. Singleton Pattern (For Admin/System Management)
The Admin class often manages system-wide settings. Using a Singleton ensures there is
a single point of control for manageSystem().
Implementation: We will restrict the Admin class to a single instance to prevent
conflicting system configurations.
5. Facade Pattern (For User Dashboard)
A User interacts with Goals, Progress, WorkoutPlans, and DietPlans. A Facade can
provide a simplified interface for the viewReport() and updateProfile() methods.
Implementation: A FitnessFacade class that will coordinate between the User,
WorkoutPlan, and DietPlan classes so the UI doesn't have to talk to five different objects
at once.
Figma design:
Link:
https://www.figma.com/design/T2t6mZHecu8DZpP12K1cCX/Untitled?node-id=0-
1&p=f&t=fBVynncRFyH8uud1-0