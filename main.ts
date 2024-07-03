
import inquirer from "inquirer"; 
import chalk from "chalk";
import Choices from "inquirer/lib/objects/choices.js"; 

class Person { 
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  getName() {
    return `${this.name}, ${this.age}`;
  }
}

class Student extends Person {
  rollNumber: number;
  courses: Course[];

  constructor(name: string, age: number, rollNumber: number) {
    super(name, age);
    this.rollNumber = rollNumber;
    this.courses = [];
  }

  registerForCourse(course: Course) {
    this.courses.push(course);
    course.addStudent(this);
  }
}

class Instructor extends Person {
  salary: number;
  courses: Course[];

  constructor(name: string, age: number, salary: number) {
    super(name, age);
    this.salary = salary;
    this.courses = [];
  }

  assignCourse(course: Course) {
    this.courses.push(course);
    course.setInstructor(this);
  }
}

class Course {
  id: number;
  name: string;
  students: Student[];
  instructors: Instructor[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.students = [];
    this.instructors = [];
  }

  addStudent(student: Student) {
    this.students.push(student);
  }

  setInstructor(instructor: Instructor) {
    this.instructors.push(instructor);
  }
}

class Department {
  name: string;
  courses: Course[];

  constructor(name: string) {
    this.name = name;
    this.courses = [];
  }

  addCourse(course: Course) {
    this.courses.push(course);
  }
}

const departments: Department[] = [];
const students: Student[] = [];
const instructors: Instructor[] = [];
const courses: Course[] = [];

async function addStudent() {
  const answers = await inquirer.prompt([
    { name: "name", message: "Enter student name:" },
    { name: "age", message: "Enter student age:", type: "number" },
    {
      name: "rollNumber",
      message: "Enter student roll number:",
      type: "number",
    },
  ]);

  const student = new Student(answers.name, answers.age, answers.rollNumber);
  students.push(student);
  console.log(chalk.green("Student added successfully"), student);
}

async function addInstructor() {
  const answers = await inquirer.prompt([
    { name: "name", message: "Enter instructor name:" },
    { name: "age", message: "Enter instructor age:", type: "number" },
    { name: "salary", message: "Enter instructor salary:", type: "number" },
  ]);

  const instructor = new Instructor(answers.name, answers.age, answers.salary);
  instructors.push(instructor);
  console.log(chalk.green("Instructor added successfully"), instructor);
}

async function addCourse() {
  const answers = await inquirer.prompt([
    { name: "id", message: "Enter course ID:", type: "number" },
    { name: "name", message: "Enter course name:" },
  ]);

  const course = new Course(answers.id, answers.name);
  courses.push(course);
  console.log(chalk.green("Course added successfully"), course);
}

async function addDepartment() {
  const answers = await inquirer.prompt([
    { name: "name", message: "Enter department name:" },
  ]);

  const department = new Department(answers.name);
  departments.push(department);
  console.log(chalk.green("Department added successfully"), department);
}

async function registerForCourse() {
  if (students.length === 0 || courses.length === 0) {
    console.log(chalk.red("No students or courses available."));
    return;
  }

  const studentChoices = students.map((student) => ({
    name: student.getName(),
    value: student,
  }));
  const courseChoices = courses.map((course) => ({
    name: course.name,
    value: course,
  }));

  const answers = await inquirer.prompt([
    {
      name: "student",
      message: "Select a student:",
      type: "list",
      choices: studentChoices,
    },
    {
      name: "course",
      message: "Select a course:",
      type: "list",
      choices: courseChoices,
    },
  ]);

  const student = answers.student;
  const course = answers.course;

  student.registerForCourse(course);
  console.log(
    chalk.green("Student registered for course successfully"),
    student
  );
}

async function assignCourse() {
  if (instructors.length === 0 || courses.length === 0) {
    console.log(chalk.red("No instructors or courses available."));
    return;
  }

  const instructorChoices = instructors.map((instructor) => ({
    name: instructor.getName(),
    value: instructor,
  }));
  const courseChoices = courses.map((course) => ({
    name: course.name,
    value: course,
  }));

  const answers = await inquirer.prompt([
    {
      name: "instructor",
      message: "Select an instructor:",
      type: "list",
      choices: instructorChoices,
    },
    {
      name: "course",
      message: "Select a course:",
      type: "list",
      choices: courseChoices,
    },
  ]);

  const instructor = answers.instructor;
  const course = answers.course;

  instructor.assignCourse(course);
  console.log(
    chalk.green("Course assigned to instructor successfully"),
    instructor
  );
}

async function showList() {
  const answers = await inquirer.prompt([
    {
      name: "listType",
      type: "list",
      message: "Select list to view:",
      choices: ["Students", "Instructors", "Courses", "Departments"],
    },
  ]);

  switch (answers.listType) {
    case "Students":
      console.log(chalk.magentaBright("\n\t List of Students: \n"));
      students.forEach((student) =>
        console.log(
          chalk.yellow(
            `\n\t Name: ${student.name}, Age: ${student.age}, Roll Number: ${
              student.rollNumber
            }, Courses: ${student.courses
              .map((course) => course.name)
              .join(", ")} \n`
          )
        )
      );
      break;
    case "Instructors":
      console.log(chalk.blue.bold("\n\t List of Instructors: \n"));
      instructors.forEach((instructor) =>
        console.log(
          chalk.green(
            `\n\t Name: ${instructor.name}, Age: ${instructor.age}, Salary: ${
              instructor.salary
            }, Courses: ${instructor.courses
              .map((course) => course.name)
              .join(", ")} \n`
          )
        )
      );
      break;
    case "Courses":
      console.log(chalk.whiteBright("\n\t List of Courses: \n"));
      courses.forEach((course) =>
        console.log(
          chalk.magenta(
            `\n\t ID: ${course.id}, Name: ${course.name}, Students: ${course.students
              .map((student) => student.name)
              .join(", ")}, Instructors: ${course.instructors
              .map((instructor) => instructor.name)
              .join(", ")} \n`
          )
        )
      );
      break;
    case "Departments":
      console.log(chalk.redBright("\n\t List of Departments: \n"));
      departments.forEach((department) =>
        console.log(
          chalk.blue(
            `\n\t Name: ${department.name}, Courses: ${department.courses
              .map((course) => course.name)
              .join(", ")} \n`
          )
        )
      );
      break;
  }
}

async function manage() {
  console.log(
    chalk.greenBright.inverse("\n\t Welcome to University Management System \n")
  );

  let condition = true;
  while (condition) {
    const answer = await inquirer.prompt([
      {
        name: "addData",
        type: "list",
        message: "Choose an option:",
        choices: [
          "Add Student",
          "Add Instructor",
          "Add Course",
          "Add Department",
          "Register for Course",
          "Assign Course",
          "View List",
          "Exit",
        ],
      },
    ]);

    switch (answer.addData) {
      case "Add Student":
        await addStudent();
        break;
      case "Add Instructor":
        await addInstructor();
        break;
      case "Add Course":
        await addCourse();
        break;
      case "Add Department":
        await addDepartment();
        break;
      case "Register for Course":
        await registerForCourse();
        break;
      case "Assign Course":
        await assignCourse();
        break;
      case "View List":
        await showList();
        break;
      case "Exit":
        console.log(
          chalk.magentaBright.bold.inverse(
            "\n\t Thank you for using University Management System!"
          )
        );
        condition = false;
        break;
    }
  }
}

await manage();






































































































































































































































































































































































































































































































































































 


















































