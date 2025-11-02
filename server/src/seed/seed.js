import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import CodeBlock from "../models/CodeBlock.js";

dotenv.config();

// sample code blocks to store in the database
const seedData = [
  {
    title: "Async case",
    slug: "async-case",
    initialCode: `// Write an async function waitAndDouble that takes a number n.\n// It should wait 1 second, then return n * 2.\n// Example: await waitAndDouble(5) ➞ 10\nasync function waitAndDouble(n){\n  // your code\n}\n`,
    solution: `async function waitAndDouble(n){\n  return new Promise(resolve => setTimeout(() => resolve(n * 2), 1000));\n}`,
    hints: [
      "Use the Promise constructor to handle asynchronous behavior",
      "Wrap setTimeout inside a Promise and resolve with n * 2 after 1000 milliseconds",
    ],
  },
  {
    title: "Array sum",
    slug: "array-sum",
    initialCode: `// sumArray([1,2,3]) => 6\nfunction sumArray(arr){\n  // your code\n}\n`,
    solution: `function sumArray(arr){\n  return arr.reduce((a,b)=>a+b,0);\n}`,
    hints: [
      "Try using an array method that can combine all elements into one value",
      "Use Array.prototype.reduce()",
    ],
  },
  {
    title: "Reverse string",
    slug: "reverse-string",
    initialCode: `// reverseString("abc") => "cba"\nfunction reverseString(s){\n  // your code\n}\n`,
    solution: `function reverseString(s){\n  return s.split('').reverse().join('');\n}`,
    hints: [
      "Consider converting the string into an array first",
      "There’s a built-in method that can reverse arrays — then you can join it back",
    ],
  },
  {
    title: "Is prime",
    slug: "is-prime",
    initialCode: `// isPrime(7) => true\nfunction isPrime(n){\n  // your code\n}\n`,
    solution: `function isPrime(n){\n  if(n<2) return false;\n  for(let i=2;i*i<=n;i++) if(n%i===0) return false;\n  return true;\n}`,
    hints: [
      "Start by handling edge cases where n is less than 2",
      "Loop from 2 to the square root of n (if divisible, it’s not prime)",
    ],
  },
];

(async function seed() {
  await connectDB(process.env.MONGODB_URI);

  // clear existing data and insert fresh data if we want to update
  await CodeBlock.deleteMany({});
  await CodeBlock.insertMany(seedData);

  process.exit(0);
})();
