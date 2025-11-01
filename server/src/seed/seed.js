import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import CodeBlock from "../models/CodeBlock.js";

dotenv.config();

const seedData = [
  {
    title: "Async case",
    slug: "async-case",
    initialCode: `// Write an async function fetchData that returns "OK"\nasync function fetchData(){\n  // your code\n}\n`,
    solution: `async function fetchData(){\n  return "OK";\n}`,
  },
  {
    title: "Array sum",
    slug: "array-sum",
    initialCode: `// sum([1,2,3]) => 6\nfunction sumArray(arr){\n  // your code\n}\n`,
    solution: `function sumArray(arr){\n  return arr.reduce((a,b)=>a+b,0);\n}`,
  },
  {
    title: "Reverse string",
    slug: "reverse-string",
    initialCode: `// reverse("abc") => "cba"\nfunction reverseString(s){\n  // your code\n}\n`,
    solution: `function reverseString(s){\n  return s.split('').reverse().join('');\n}`,
  },
  {
    title: "Is prime",
    slug: "is-prime",
    initialCode: `// isPrime(7) => true\nfunction isPrime(n){\n  // your code\n}\n`,
    solution: `function isPrime(n){\n  if(n<2) return false;\n  for(let i=2;i*i<=n;i++) if(n%i===0) return false;\n  return true;\n}`,
  },
];

(async function seed() {
  await connectDB(process.env.MONGODB_URI);

  await CodeBlock.deleteMany({});
  await CodeBlock.insertMany(seedData);

  process.exit(0);
})();
