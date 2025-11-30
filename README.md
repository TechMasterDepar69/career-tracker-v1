# 🚀 Career Analytics Dashboard (Full Stack)

A data-driven job application tracker designed to help job seekers manage their pipeline and analyze performance metrics. This application replaces spreadsheet chaos with a structured database and real-time visualization.

**[View Live Demo](https://career-tracker-portfolio.onrender.com)**

---

## 📊 Key Features

* **Lifecycle Management:** Full CRUD capabilities (Create, Read, Update, Delete) for job applications.
* **Real-Time Analytics:** Dashboard showing Total Applications, Interviews, and Success Rate calculations.
* **Data Visualization:** Integrated **Chart.js** to render dynamic status breakdowns (Applied vs. Interview vs. Rejected).
* **Data Portability:** One-click export to **CSV** for deep-dive analysis in Excel or Power BI.
* **Strict Schema:** MongoDB validation ensures data integrity (no missing salaries or invalid dates).

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+), Chart.js
* **Backend:** Node.js, Express.js (REST API)
* **Database** MongoDB Atlas (Cloud NoSQL), Mongoose ODM
* **Deployment** Render (Web Service), GitHub (CI/CD)

---

## 📸 Screenshots

> **Dashboard View**
> *Shows the stats and the "Add Job" interface.*
> ![Dashboard](https://github.com/user-attachments/assets/35c81795-4b19-4fba-b68d-f4bfd93be7bc)


> **Analytics View**
> *Shows the Donut Chart and Success Rate metrics.*
> ![Analytics](https://github.com/user-attachments/assets/dca9d376-63d5-46b1-aff5-c8b297c63082)

---

## 🔧 How to Run Locally

If you want to run this project on your own machine:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/TechMasterDepar69/career-tracker-v1.git](https://github.com/YOUR_USERNAME/career-tracker-v1.git)
    cd career-tracker-v1
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your MongoDB connection:
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    ```

4.  **Run the Server**
    ```bash
    npm run dev
    ```

5.  **Open Browser**
    Visit `http://localhost:5000`

---

## 👨‍💻 Author

**Depar Min Htet**
* **GitHub:** [TechMasterDepar69](https://github.com/TechMasterDepar69)
* **Email:** techmasterdepar69@gmail.com

---

*This project was built as part of a Full Stack Data Analysis portfolio.*
