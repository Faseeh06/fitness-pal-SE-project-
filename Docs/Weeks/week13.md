Department of Computing
Faculty of Computing
BSCS-13E
Software Engineering SE-200
UML & UI FLOW
Fitness Tracking & Coaching System
Name Qalam Id
Laiba Riaz 464486
Muhammad Faseeh 456267
Obaid Ishtiaq Satti 464870
Moin Ud Din Abdur Rehman Azim 426112
Submitted to: Sir Sarosh Tahir
1. Use Case Diagram
System Name:
Fitness Tracking & Coaching System
Actors:
• User
• Trainer
• Admin
Use Cases
User
• Register
• Login
• Manage Profile
• Set Fitness Goals
• View Dashboard
• Track Steps
• Track Calories
• View Workout Plan
• View Diet Plan
• View Progress
• Receive Notifications
Trainer
• Create Workout Plan
• Create Diet Plan
• Update Plans
Admin
• Manage Users
• Manage System Data
Relationships
• User interacts with all user functionalities
• Trainer manages workout & diet plans
• Admin controls system operations
• “View Dashboard” includes:
o View Progress
o Track Steps
• The use case diagram represents the functional behavior of the AI Fitness Trainer
System. It identifies three main actors: User, Trainer, and Admin. The User is the primary
actor who interacts with the system to perform activities such as registration, login,
profile management, goal setting, activity tracking, and viewing progress.
• The Trainer is responsible for creating and updating workout and diet plans, which are
used by the system to guide users. The admin manages users and system data, ensuring
proper functioning of the system.
• The diagram also shows relationships between use cases. For example, the “View
Dashboard” use case includes other functionalities such as viewing progress, tracking
steps, and tracking calories. This provides a structured overview of how different system
components interact and ensures clarity of system functionality.
2. Class Diagram
Main Classes:
User:
Attributes:
• userID
• name
• email
• password
• age
• weight
• height
Methods:
• register()
• login()
• updateProfile()
• setGoals()
Goal:
Attributes:
• goalID
• targetWeight
• dailySteps
• calorieTarget
Methods:
• setGoal()
• updateGoal()
Progress:
Attributes:
• progressID
• date
• steps
• caloriesBurned
Methods:
• trackProgress()
• viewReport()
WorkoutPlan:
Attributes:
• planID
• exercises
• duration
Methods:
• generatePlan()
• updatePlan()
DietPlan:
Attributes:
• dietID
• meals
• calories
Methods:
• suggestDiet()
• updateDiet()
Trainer:
Attributes:
• trainerID
• name
Methods:
• createPlan()
• updatePlan()
Admin:
Attributes:
• adminID
• name
Methods:
• manageUsers()
• manageSystem()
Relationships
• User → Goal (1 to 1)
• User → Progress (1 to many)
• User → WorkoutPlan (1 to 1)
• User → DietPlan (1 to 1)
• Trainer → WorkoutPlan
• Trainer → DietPlan
• Admin → User
The class diagram represents the structural design of the AI Fitness Trainer System by defining
its main classes, attributes, methods, and relationships. The central class is the User, which stores
personal information such as name, email, age, weight, and fitness goals.
The User is connected to the Goal class, which manages fitness targets such as steps and calorie
limits. The Progress class tracks user activities including daily steps and calories burned. The
Workout Plan and DietPlan classes store personalized plans generated for the user.
The Trainer class is responsible for creating and updating workout and diet plans, while the
admin class manages users and system data. The relationships between classes show how data
flows within the system and how different components interact with each other. This diagram
helps in understanding the overall system structure and supports future implementation.
3. Sequence Diagrams:
1. User Sign In, Profile Management, and Diet Plan:
2. Plan Creation by Trainer:
4. Activity Diagrams:
1. User Login:
2. Track Workout:
3.Track Calories:
4. Jira Board:
Sprint Update
Sprint Name: Sprint 2 – Diagrams & Design
Goal:
Develop UML diagrams and UI structure
Completed Tasks:
• SRS Documentation
• Use Case Descriptions
• Problem Analysis
In Progress:
• Activity Diagrams
• Class Diagram
• UI Design
Progress: ~60% complete
5. Figma link:
https://www.figma.com/design/T2t6mZHecu8DZpP12K1cCX/Un
titled?node-id=0-1&t=vFAggYG1b2uKyQwQ-1