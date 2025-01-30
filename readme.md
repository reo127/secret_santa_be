# 🎅 Secret Santa Assignment System  

## 📖 Project Overview  
### 🔗 Live preview [click here](https://secret-santa-fe-gilt.vercel.app/)
The **Secret Santa Assignment System** backend designed to automate the process of assigning anonymous gift recipients (Secret Children) to employees for the annual Secret Santa event. The system ensures assignments are fair and follow specific rules, such as:  

- An employee cannot be their own Secret Santa.  
- No repeat assignments from the previous year's event.  
- Each employee has exactly one unique Secret Child.  

The application reads employee data and last year's assignments from CSV files, generates a unique list of assignments, and writes the results to a new excel file.  

---

## 🛠️ Features  
- **Automated Secret Santa Assignment**: Fair and randomized gift assignments.  
- **Constraint Handling**: Avoids self-selection and repeated assignments.   
- **CSV Export**: Outputs results in a ready-to-use CSV format.  

---

## 🚀 Getting Started  

### 1️⃣ Prerequisites  
Make sure you have the following installed:  
- NodeJS 

### 2️⃣ Installation  

1. **Clone the repository:**  
   ```bash
   git clone https://github.com/reo127/secret_santa_be
   cd secret_santa_be
   npm install
   npm start
   ```
then if frontend is not running then follow this [repo](https://github.com/reo127/secret_santa_fe)
