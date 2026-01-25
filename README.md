# Service Sync 📍

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green) ![Status](https://img.shields.io/badge/Status-Active-success) ![License](https://img.shields.io/badge/License-MIT-blue)

> **Your Digital Companion for Hostel Life & Local Living.** > *Hyper-Local Service Discovery Platform powered by AI & Geolocation.*

---

## 📖 Overview

**Service Sync** is a full-stack web application designed to help students and residents in new cities find essential local services instantly. Whether it's finding the nearest **xerox shop**, **hostel**, or **emergency medical aid**, Service Sync connects users to verified local businesses using real-time GPS navigation and AI assistance.

### 🌟 Key Features

* **🤖 Service Sync AI:** Integrated **Google Gemini Chatbot** to answer natural language queries (e.g., *"Where can I buy a mattress nearby?"*).
* **📍 Live GPS Navigation:** Interactive Google Map showing services relative to your current standing location.
* **⭐ Community Reviews:** Robust 5-star rating system allowing users to read and write genuine feedback.
* **🎓 Student Zone:** Specialized filters for academic needs (Stationery, Printing, Hostels).
* **🛡️ Role-Based Access:** Secure dashboards for **Users** (View/Review), **Businesses** (Manage Listings), and **Admins** (Moderation).
* **🚑 Emergency Mode:** One-click access to nearest hospitals and pharmacies.

---

## 🛠️ Technology Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Axios, Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication** | JWT (JSON Web Tokens), Google OAuth 2.0, Bcrypt |
| **AI & APIs** | Google Gemini API, Google Maps Embed API |
| **Deployment** | Vercel (Client), Render (Server) |

---

## 📸 Screenshots

*(Add your screenshots here)*

| Home Page | Service Details | AI Chatbot |
| :---: | :---: | :---: |
| ![Home](path/to/image1.png) | ![Details](path/to/image2.png) | ![Chat](path/to/image3.png) |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Node.js & npm installed
* MongoDB Atlas Connection String
* Google Gemini API Key

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/service-sync.git](https://github.com/your-username/service-sync.git)
cd service-sync




## 📖 How to Use Service Sync

1.  **🔐 Secure Login:**
    * Start by clicking **"Sign in with Google"**. This creates a secure, personalized account instantly without needing to remember a new password.

2.  **📍 Enable Location Access:**
    * Upon entering the dashboard, click **"Allow"** when prompted for location permissions. This allows the **Live Map** to center on your position and load service markers (Shops, Hostels) in your immediate vicinity.

3.  **📂 Choose Your Mode:**
    * Use the **Category Filters** to switch between modes:
        * **🎓 Student Zone:** For stationery, xerox, and books.
        * **🚑 Emergency:** For hospitals and pharmacies.
        * **🚖 Transport:** For auto stands and bus stops.

4.  **🤖 Ask the AI Assistant:**
    * If you can't find what you need, click the **Chatbot Icon**. Type natural questions like *"Where is the cheapest hostel nearby?"* or *"Is there a medical shop open now?"* to get an instant, AI-generated answer.

5.  **🗺️ View Details & Navigate:**
    * Click on any service card to view contact numbers, pricing, and photos.
    * Hit the **"Get Directions"** button to automatically open the destination in **Google Maps** for turn-by-turn voice navigation.

6.  **⭐ Rate & Review:**
    * After using a service, help the community by leaving a **Star Rating (1-5)** and a short review. Your feedback helps other students avoid bad experiences and find the best spots.
