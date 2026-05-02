# FitPal — Complete Requirements Document

---

##  Project Goal

Build a **fully functional fitness tracking and coaching web application** that allows users to manage workouts, track progress, monitor nutrition, log hydration, and receive intelligent recommendations.

The system should include **end-to-end user flow, data handling, analytics, and testing support**.

---

##  User Roles

### 1. User

* Register and login
* Access dashboard
* Track workouts
* Monitor progress
* Manage nutrition
* Log hydration
* Update profile
* Receive AI-based suggestions

---

## Core Functional Requirements

### 1. Authentication

* User can sign up (name, email, password)
* User can login/logout
* Validate credentials
* Show error for invalid login
* Redirect to dashboard after login

---

### 2. Dashboard

* Display user name
* Show:

  * Daily stats (calories, steps)
  * Weekly summary
* Navigation to all modules
* Quick action buttons

---

### 3. Workout Module

* Display workout categories (cardio, strength)
* Show workout details
* Start workout
* Mark workout as completed
* Store:

  * duration
  * calories burned
* View workout history

---

### 4. Progress Tracking

* Track:

  * weight
  * calories
  * steps
* Display:

  * daily progress
  * weekly summary
* Show charts (basic visualization)

---

### 5. Nutrition Module

* Display meal plans
* Select meals
* Show calorie details
* Track daily intake

---

### 6. Hydration Tracking

* Add water intake
* Display total daily intake
* Show progress bar

---

### 7. Profile Management

* View profile
* Edit:

  * name
  * weight
  * height
  * goals
* Save changes

---

### 8. Schedule System

* Show daily/weekly schedule
* Add activity
* Display planned workouts

---

### 9. Articles & Tips

* Show fitness articles
* View detailed content

---

##  AI Assistant 

### Features

* Suggest workouts based on goal
* Suggest meal plans
* Recommend daily targets

### Behavior

* Input: user goal (weight loss / muscle gain)
* Output:

  * workout plan
  * meal suggestions

### Logic

* Rule-based system:

  * Weight loss → cardio + calorie deficit meals
  * Muscle gain → strength + protein meals

---

## Navigation Flow

Login → Dashboard

Signup → Login → Dashboard

From Dashboard:

* Workout
* Nutrition
* Hydration
* Progress
* Schedule
* Profile
* AI Suggestions

---

##  Required Screens

1. Login
2. Signup
3. Dashboard
4. Workout List
5. Workout Detail
6. Progress
7. Nutrition
8. Hydration
9. Schedule
10. Profile
11. AI Suggestions

---

##  Data Requirements

### User

* id
* name
* email
* password
* age
* weight
* height
* goal

---

### Workout

* id
* name
* category
* duration
* calories

---

### Progress

* date
* weight
* steps
* calories

---

### Meal

* id
* name
* calories
* type

---

### Hydration

* amount
* date

---

##  Technical Requirements

* Frontend: HTML, CSS, JavaScript (or React)
* Storage: localStorage (minimum)
* Optional Backend: Firebase / Node.js
* Optional Analytics: Firebase

---
