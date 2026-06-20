import { t } from "../components/translations"
import Navbar from "../components/Navbar"
import { useTheme } from "../components/useTheme"
import { useState, useEffect } from "react"
import ProgressBar from "../components/ProgressBar"
import { useNavigate, useLocation } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"

const pythonQuestions = [
  { id: 1, question: "Python किसने बनाया?", options: ["Bill Gates", "Guido van Rossum", "Steve Jobs", "Elon Musk"], answer: 1 },
  { id: 2, question: "Python कब बना?", options: ["1980", "1995", "1991", "2000"], answer: 2 },
  { id: 3, question: "Screen पर text दिखाने के लिए कौन सा function use होता है?", options: ["input()", "show()", "print()", "display()"], answer: 2 },
  { id: 4, question: "Variable क्या होता है?", options: ["एक number", "data रखने का box", "एक function", "एक error"], answer: 1 },
  { id: 5, question: "naam = 'Sharada' में naam क्या है?", options: ["function", "variable", "number", "error"], answer: 1 },
  { id: 6, question: "User से input लेने के लिए कौन सा function use होता है?", options: ["print()", "scan()", "input()", "read()"], answer: 2 },
  { id: 7, question: "पूरी संख्या जैसे 5, 10 किस data type में आती है?", options: ["float", "string", "bool", "int"], answer: 3 },
  { id: 8, question: "True या False किस data type में आता है?", options: ["int", "float", "bool", "string"], answer: 2 },
  { id: 9, question: "If/Else किसलिए use होता है?", options: ["Loop के लिए", "Condition check के लिए", "Function बनाने के लिए", "Input लेने के लिए"], answer: 1 },
  { id: 10, question: "For loop में range(1, 5) कितनी बार चलेगा?", options: ["5 बार", "4 बार", "3 बार", "6 बार"], answer: 1 },
  { id: 11, question: "While loop कब तक चलता है?", options: ["एक बार", "पाँच बार", "जब तक condition सही हो", "कभी नहीं"], answer: 2 },
  { id: 12, question: "List किसमें लिखी जाती है?", options: ["() brackets", "{} brackets", "[] brackets", "<> brackets"], answer: 2 },
  { id: 13, question: "Function बनाने के लिए कौन सा keyword use होता है?", options: ["func", "define", "def", "function"], answer: 2 },
  { id: 14, question: "string को uppercase करने के लिए क्या use होता है?", options: [".lower()", ".upper()", ".title()", ".big()"], answer: 1 },
  { id: 15, question: "शेषफल निकालने के लिए कौन सा operator use होता है?", options: ["/", "*", "%", "//"], answer: 2 },
  { id: 16, question: "Comment लिखने के लिए कौन सा symbol use होता है?", options: ["//", "/*", "#", "--"], answer: 2 },
  { id: 17, question: "Error handle करने के लिए क्या use होता है?", options: ["if/else", "try/except", "for/while", "def/return"], answer: 1 },
  { id: 18, question: "list की length निकालने के लिए क्या use होता है?", options: ["size()", "count()", "length()", "len()"], answer: 3 },
  { id: 19, question: "3.14 किस data type में आता है?", options: ["int", "string", "float", "bool"], answer: 2 },
  { id: 20, question: "दो strings जोड़ने के लिए कौन सा operator use होता है?", options: ["*", "-", "+", "/"], answer: 2 },
  { id: 21, question: "list में नया item add करने के लिए कौन सा method use होता है?", options: ["add()", "insert()", "append()", "push()"], answer: 2 },
  { id: 22, question: "Python में indentation के लिए कितने spaces use होते हैं?", options: ["2", "4", "6", "8"], answer: 1 },
  { id: 23, question: "range(0, 10, 2) से कौन से numbers आएंगे?", options: ["0,2,4,6,8", "0,2,4,6,8,10", "2,4,6,8,10", "1,3,5,7,9"], answer: 0 },
  { id: 24, question: "Python में string की length निकालने के लिए क्या use होता है?", options: ["size()", "length()", "len()", "count()"], answer: 2 },
  { id: 25, question: "Python में f-string का उदाहरण कौन सा है?", options: ['f"नमस्ते {naam}"', '"नमस्ते" + naam', 'print(naam)', 'format(naam)'], answer: 0 },
  { id: 26, question: "def keyword किसके लिए use होता है?", options: ["Variable बनाने के लिए", "Loop के लिए", "Function define करने के लिए", "Condition के लिए"], answer: 2 },
  { id: 27, question: "Python में None का क्या मतलब है?", options: ["Zero", "False", "कोई value नहीं", "Error"], answer: 2 },
  { id: 28, question: "list में से किसी item को हटाने के लिए कौन सा method use होता है?", options: ["delete()", "remove()", "pop() only", "clear()"], answer: 1 },
  { id: 29, question: "Python में 2 ** 3 का result क्या होगा?", options: ["6", "5", "8", "9"], answer: 2 },
  { id: 30, question: "Python में string को split करने के लिए कौन सा method use होता है?", options: ["divide()", "break()", "split()", "cut()"], answer: 2 },
  { id: 31, question: "try block में क्या लिखते हैं?", options: ["वो code जो हमेशा चले", "वो code जिसमें error आ सकती है", "Function का code", "Loop का code"], answer: 1 },
  { id: 32, question: "Python में list का पहला element किस index पर होता है?", options: ["1", "0", "-1", "2"], answer: 1 },
  { id: 33, question: "while True: loop कब बंद होगा?", options: ["अपने आप", "कभी नहीं, जब तक break न हो", "5 बार बाद", "10 बार बाद"], answer: 1 },
  { id: 34, question: "Python में किस keyword से function value return करता है?", options: ["give", "send", "return", "output"], answer: 2 },
  { id: 35, question: "input() function किस data type में value देता है?", options: ["int", "float", "bool", "string"], answer: 3 },
  { id: 36, question: "Python में equal check करने के लिए कौन सा operator use होता है?", options: ["=", "==", "===", "!="], answer: 1 },
  { id: 37, question: "Python में list के आखिरी element को कैसे access करते हैं?", options: ["list[0]", "list[last]", "list[-1]", "list[end]"], answer: 2 },
  { id: 38, question: "import keyword किसलिए use होता है?", options: ["Variable बनाने के लिए", "Module को program में लाने के लिए", "Function बनाने के लिए", "Loop के लिए"], answer: 1 },
  { id: 39, question: "Python में not operator क्या करता है?", options: ["दो values जोड़ता है", "Boolean value को उल्टा कर देता है", "Number को negative बनाता है", "String को reverse करता है"], answer: 1 },
  { id: 40, question: "Python में dictionary किसमें लिखी जाती है?", options: ["[] brackets", "() brackets", "{} brackets", "<> brackets"], answer: 2 },

];
// ─────────────────────────────────────────
// PYTHON QUESTIONS — ENGLISH (all 40)
// ─────────────────────────────────────────
const pythonQuestionsEnglish = [
  { id: 1, question: "Who created Python?", options: ["Bill Gates", "Guido van Rossum", "Steve Jobs", "Elon Musk"], answer: 1 },
  { id: 2, question: "In which year was Python created?", options: ["1980", "1995", "1991", "2000"], answer: 2 },
  { id: 3, question: "Which function is used to display text on the screen?", options: ["input()", "show()", "print()", "display()"], answer: 2 },
  { id: 4, question: "What is a variable?", options: ["A number", "A box to store data", "A function", "An error"], answer: 1 },
  { id: 5, question: "In naam = 'Sharada', what is naam?", options: ["function", "variable", "number", "error"], answer: 1 },
  { id: 6, question: "Which function is used to take input from the user?", options: ["print()", "scan()", "input()", "read()"], answer: 2 },
  { id: 7, question: "Which data type does a whole number like 5 or 10 belong to?", options: ["float", "string", "bool", "int"], answer: 3 },
  { id: 8, question: "Which data type has only True or False values?", options: ["int", "float", "bool", "string"], answer: 2 },
  { id: 9, question: "What is If/Else used for?", options: ["For loops", "For checking conditions", "For creating functions", "For taking input"], answer: 1 },
  { id: 10, question: "How many times will range(1, 5) run in a for loop?", options: ["5 times", "4 times", "3 times", "6 times"], answer: 1 },
  { id: 11, question: "How long does a while loop run?", options: ["Once", "Five times", "As long as the condition is true", "Never"], answer: 2 },
  { id: 12, question: "Inside which brackets is a list written?", options: ["() brackets", "{} brackets", "[] brackets", "<> brackets"], answer: 2 },
  { id: 13, question: "Which keyword is used to create a function?", options: ["func", "define", "def", "function"], answer: 2 },
  { id: 14, question: "What is used to convert a string to uppercase?", options: [".lower()", ".upper()", ".title()", ".big()"], answer: 1 },
  { id: 15, question: "Which operator is used to get the remainder?", options: ["/", "*", "%", "//"], answer: 2 },
  { id: 16, question: "Which symbol is used to write a comment in Python?", options: ["//", "/*", "#", "--"], answer: 2 },
  { id: 17, question: "What is used to handle errors in Python?", options: ["if/else", "try/except", "for/while", "def/return"], answer: 1 },
  { id: 18, question: "What is used to find the length of a list?", options: ["size()", "count()", "length()", "len()"], answer: 3 },
  { id: 19, question: "Which data type does 3.14 belong to?", options: ["int", "string", "float", "bool"], answer: 2 },
  { id: 20, question: "Which operator is used to join two strings?", options: ["*", "-", "+", "/"], answer: 2 },
  { id: 21, question: "Which method is used to add a new item to a list?", options: ["add()", "insert()", "append()", "push()"], answer: 2 },
  { id: 22, question: "How many spaces are used for indentation in Python?", options: ["2", "4", "6", "8"], answer: 1 },
  { id: 23, question: "What numbers will range(0, 10, 2) produce?", options: ["0,2,4,6,8", "0,2,4,6,8,10", "2,4,6,8,10", "1,3,5,7,9"], answer: 0 },
  { id: 24, question: "What is used to find the length of a string?", options: ["size()", "length()", "len()", "count()"], answer: 2 },
  { id: 25, question: "Which of these is an example of an f-string?", options: ['f"Hello {name}"', '"Hello" + name', 'print(name)', 'format(name)'], answer: 0 },
  { id: 26, question: "What is the def keyword used for?", options: ["To create a variable", "For a loop", "To define a function", "For a condition"], answer: 2 },
  { id: 27, question: "What does None mean in Python?", options: ["Zero", "False", "No value at all", "Error"], answer: 2 },
  { id: 28, question: "Which method is used to remove an item from a list?", options: ["delete()", "remove()", "pop() only", "clear()"], answer: 1 },
  { id: 29, question: "What is the result of 2 ** 3 in Python?", options: ["6", "5", "8", "9"], answer: 2 },
  { id: 30, question: "Which method is used to split a string?", options: ["divide()", "break()", "split()", "cut()"], answer: 2 },
  { id: 31, question: "What do we write inside the try block?", options: ["Code that always runs", "Code that might cause an error", "Function code", "Loop code"], answer: 1 },
  { id: 32, question: "At which index is the first element of a list in Python?", options: ["1", "0", "-1", "2"], answer: 1 },
  { id: 33, question: "When will a while True loop stop?", options: ["By itself", "Never, unless there is a break", "After 5 times", "After 10 times"], answer: 1 },
  { id: 34, question: "Which keyword makes a function send back a value?", options: ["give", "send", "return", "output"], answer: 2 },
  { id: 35, question: "What data type does the input() function return?", options: ["int", "float", "bool", "string"], answer: 3 },
  { id: 36, question: "Which operator is used to check equality in Python?", options: ["=", "==", "===", "!="], answer: 1 },
  { id: 37, question: "How do you access the last element of a list in Python?", options: ["list[0]", "list[last]", "list[-1]", "list[end]"], answer: 2 },
  { id: 38, question: "What is the import keyword used for?", options: ["To create a variable", "To bring a module into the program", "To create a function", "For a loop"], answer: 1 },
  { id: 39, question: "What does the not operator do in Python?", options: ["Adds two values", "Reverses a Boolean value", "Makes a number negative", "Reverses a string"], answer: 1 },
  { id: 40, question: "Inside which brackets is a dictionary written in Python?", options: ["[] brackets", "() brackets", "{} brackets", "<> brackets"], answer: 2 },
];

// ─────────────────────────────────────────
// PYTHON QUESTIONS — MARATHI (all 40)
// ─────────────────────────────────────────
const pythonQuestionsMarathi = [
  { id: 1, question: "Python कोणी बनवली?", options: ["Bill Gates", "Guido van Rossum", "Steve Jobs", "Elon Musk"], answer: 1 },
  { id: 2, question: "Python कोणत्या वर्षी बनवली गेली?", options: ["1980", "1995", "1991", "2000"], answer: 2 },
  { id: 3, question: "Screen वर text दाखवण्यासाठी कोणते function वापरतात?", options: ["input()", "show()", "print()", "display()"], answer: 2 },
  { id: 4, question: "Variable म्हणजे काय?", options: ["एक number", "data ठेवण्याचा डबा", "एक function", "एक error"], answer: 1 },
  { id: 5, question: "naam = 'Sharada' मध्ये naam काय आहे?", options: ["function", "variable", "number", "error"], answer: 1 },
  { id: 6, question: "User कडून input घेण्यासाठी कोणते function वापरतात?", options: ["print()", "scan()", "input()", "read()"], answer: 2 },
  { id: 7, question: "5 किंवा 10 सारखी पूर्ण संख्या कोणत्या data type मध्ये येते?", options: ["float", "string", "bool", "int"], answer: 3 },
  { id: 8, question: "True किंवा False कोणत्या data type मध्ये येते?", options: ["int", "float", "bool", "string"], answer: 2 },
  { id: 9, question: "If/Else कशासाठी वापरतात?", options: ["Loop साठी", "Condition check साठी", "Function बनवण्यासाठी", "Input घेण्यासाठी"], answer: 1 },
  { id: 10, question: "for loop मध्ये range(1, 5) किती वेळा चालेल?", options: ["5 वेळा", "4 वेळा", "3 वेळा", "6 वेळा"], answer: 1 },
  { id: 11, question: "while loop किती वेळ चालतो?", options: ["एकदा", "पाच वेळा", "जोपर्यंत condition बरोबर असेल", "कधीही नाही"], answer: 2 },
  { id: 12, question: "List कोणत्या brackets मध्ये लिहतात?", options: ["() brackets", "{} brackets", "[] brackets", "<> brackets"], answer: 2 },
  { id: 13, question: "Function बनवण्यासाठी कोणता keyword वापरतात?", options: ["func", "define", "def", "function"], answer: 2 },
  { id: 14, question: "String uppercase करण्यासाठी काय वापरतात?", options: [".lower()", ".upper()", ".title()", ".big()"], answer: 1 },
  { id: 15, question: "बाकी (remainder) काढण्यासाठी कोणता operator वापरतात?", options: ["/", "*", "%", "//"], answer: 2 },
  { id: 16, question: "Python मध्ये comment लिहण्यासाठी कोणता symbol वापरतात?", options: ["//", "/*", "#", "--"], answer: 2 },
  { id: 17, question: "Python मध्ये error handle करण्यासाठी काय वापरतात?", options: ["if/else", "try/except", "for/while", "def/return"], answer: 1 },
  { id: 18, question: "List ची length काढण्यासाठी काय वापरतात?", options: ["size()", "count()", "length()", "len()"], answer: 3 },
  { id: 19, question: "3.14 कोणत्या data type मध्ये येते?", options: ["int", "string", "float", "bool"], answer: 2 },
  { id: 20, question: "दोन strings जोडण्यासाठी कोणता operator वापरतात?", options: ["*", "-", "+", "/"], answer: 2 },
  { id: 21, question: "List मध्ये नवीन item add करण्यासाठी कोणती method वापरतात?", options: ["add()", "insert()", "append()", "push()"], answer: 2 },
  { id: 22, question: "Python मध्ये indentation साठी किती spaces वापरतात?", options: ["2", "4", "6", "8"], answer: 1 },
  { id: 23, question: "range(0, 10, 2) मधून कोणते numbers येतील?", options: ["0,2,4,6,8", "0,2,4,6,8,10", "2,4,6,8,10", "1,3,5,7,9"], answer: 0 },
  { id: 24, question: "String ची length काढण्यासाठी काय वापरतात?", options: ["size()", "length()", "len()", "count()"], answer: 2 },
  { id: 25, question: "f-string चे उदाहरण कोणते आहे?", options: ['f"नमस्कार {naam}"', '"नमस्कार" + naam', 'print(naam)', 'format(naam)'], answer: 0 },
  { id: 26, question: "def keyword कशासाठी वापरतात?", options: ["Variable बनवण्यासाठी", "Loop साठी", "Function define करण्यासाठी", "Condition साठी"], answer: 2 },
  { id: 27, question: "Python मध्ये None चा अर्थ काय आहे?", options: ["Zero", "False", "कोणतीही value नाही", "Error"], answer: 2 },
  { id: 28, question: "List मधून item काढण्यासाठी कोणती method वापरतात?", options: ["delete()", "remove()", "pop() only", "clear()"], answer: 1 },
  { id: 29, question: "Python मध्ये 2 ** 3 चे result काय असेल?", options: ["6", "5", "8", "9"], answer: 2 },
  { id: 30, question: "String split करण्यासाठी कोणती method वापरतात?", options: ["divide()", "break()", "split()", "cut()"], answer: 2 },
  { id: 31, question: "try block मध्ये काय लिहतात?", options: ["नेहमी चालणारा code", "ज्यात error येऊ शकते असा code", "Function चा code", "Loop चा code"], answer: 1 },
  { id: 32, question: "Python मध्ये list च्या पहिल्या element चा index कोणता असतो?", options: ["1", "0", "-1", "2"], answer: 1 },
  { id: 33, question: "while True: loop कधी बंद होईल?", options: ["आपोआप", "कधीही नाही, break शिवाय", "5 वेळांनंतर", "10 वेळांनंतर"], answer: 1 },
  { id: 34, question: "कोणत्या keyword ने function value परत देतो?", options: ["give", "send", "return", "output"], answer: 2 },
  { id: 35, question: "input() function कोणत्या data type मध्ये value देतो?", options: ["int", "float", "bool", "string"], answer: 3 },
  { id: 36, question: "Python मध्ये equality check करण्यासाठी कोणता operator वापरतात?", options: ["=", "==", "===", "!="], answer: 1 },
  { id: 37, question: "Python मध्ये list च्या शेवटच्या element ला कसे access करतात?", options: ["list[0]", "list[last]", "list[-1]", "list[end]"], answer: 2 },
  { id: 38, question: "import keyword कशासाठी वापरतात?", options: ["Variable बनवण्यासाठी", "Module program मध्ये आणण्यासाठी", "Function बनवण्यासाठी", "Loop साठी"], answer: 1 },
  { id: 39, question: "Python मध्ये not operator काय करतो?", options: ["दोन values जोडतो", "Boolean value उलटी करतो", "Number negative बनवतो", "String reverse करतो"], answer: 1 },
  { id: 40, question: "Python मध्ये dictionary कोणत्या brackets मध्ये लिहतात?", options: ["[] brackets", "() brackets", "{} brackets", "<> brackets"], answer: 2 },
]


// ─────────────────────────────────────────
// SQL QUESTIONS — HINDI (40)
// ─────────────────────────────────────────
const sqlQuestions = [
  { id: 1, question: "SQL का full form क्या है?", options: ["Simple Query Language", "Structured Query Language", "System Query Language", "Standard Query Language"], answer: 1 },
  { id: 2, question: "Database से data निकालने के लिए कौन सा command use होता है?", options: ["INSERT", "UPDATE", "SELECT", "DELETE"], answer: 2 },
  { id: 3, question: "WHERE clause किसलिए use होता है?", options: ["Data sort करने के लिए", "Data filter करने के लिए", "Table बनाने के लिए", "Data delete करने के लिए"], answer: 1 },
  { id: 4, question: "नया data database में डालने के लिए कौन सा command use होता है?", options: ["SELECT", "UPDATE", "DELETE", "INSERT"], answer: 3 },
  { id: 5, question: "Database में पुराना data बदलने के लिए कौन सा command use होता है?", options: ["INSERT", "UPDATE", "SELECT", "CREATE"], answer: 1 },
  { id: 6, question: "Data को sort करने के लिए कौन सा clause use होता है?", options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"], answer: 2 },
  { id: 7, question: "Rows की संख्या निकालने के लिए कौन सा function use होता है?", options: ["SUM()", "AVG()", "COUNT()", "MAX()"], answer: 2 },
  { id: 8, question: "नई table बनाने के लिए कौन सा command use होता है?", options: ["NEW TABLE", "CREATE TABLE", "MAKE TABLE", "ADD TABLE"], answer: 1 },
  { id: 9, question: "दो tables को जोड़ने के लिए कौन सा command use होता है?", options: ["MERGE", "COMBINE", "JOIN", "CONNECT"], answer: 2 },
  { id: 10, question: "SELECT * FROM students में * का मतलब क्या है?", options: ["कोई data नहीं", "सभी columns", "पहला column", "आखिरी column"], answer: 1 },
  { id: 11, question: "Database से data हटाने के लिए कौन सा command use होता है?", options: ["REMOVE", "DELETE", "DROP", "CLEAR"], answer: 1 },
  { id: 12, question: "ORDER BY DESC का मतलब क्या है?", options: ["छोटे से बड़े", "बड़े से छोटे", "Random order", "Alphabetical"], answer: 1 },
  { id: 13, question: "SQL में text values को किसके अंदर लिखते हैं?", options: ["Double quotes", "Single quotes", "Brackets", "Stars"], answer: 1 },
  { id: 14, question: "PRIMARY KEY क्या होती है?", options: ["सबसे बड़ी value", "हर row को uniquely identify करने वाला column", "पहला column", "Foreign key"], answer: 1 },
  { id: 15, question: "AVG() function क्या करता है?", options: ["सबसे बड़ी value देता है", "सबसे छोटी value देता है", "Average निकालता है", "Count करता है"], answer: 2 },
  { id: 16, question: "UPDATE command में WHERE क्यों जरूरी है?", options: ["Speed के लिए", "ताकि सिर्फ specific row update हो", "Syntax की वजह से", "जरूरी नहीं है"], answer: 1 },
  { id: 17, question: "VARCHAR data type किसके लिए use होता है?", options: ["Numbers के लिए", "Text के लिए", "Dates के लिए", "Boolean के लिए"], answer: 1 },
  { id: 18, question: "MAX() function क्या करता है?", options: ["Minimum value देता है", "Maximum value देता है", "Average देता है", "Count करता है"], answer: 1 },
  { id: 19, question: "SQL में AND operator क्या करता है?", options: ["एक condition check करता है", "दोनों conditions सच होनी चाहिए", "कोई एक condition सच हो", "Condition नकारता है"], answer: 1 },
  { id: 20, question: "INNER JOIN क्या दिखाता है?", options: ["सिर्फ पहली table के records", "दोनों tables में matching records", "सभी records", "Empty records"], answer: 1 },
  { id: 21, question: "NOT NULL constraint का मतलब क्या है?", options: ["Column zero हो सकता है", "Column खाली नहीं रह सकता", "Column delete हो सकता है", "Column optional है"], answer: 1 },
  { id: 22, question: "SUM() function क्या करता है?", options: ["Count करता है", "Average देता है", "सभी values का जोड़ देता है", "Maximum देता है"], answer: 2 },
  { id: 23, question: "SQL में comment कैसे लिखते हैं?", options: ["# comment", "// comment", "-- comment", "/* comment only */"], answer: 2 },
  { id: 24, question: "DROP TABLE command क्या करता है?", options: ["Table खाली करता है", "Table और उसका सारा data हटाता है", "Table rename करता है", "Table copy करता है"], answer: 1 },
  { id: 25, question: "LIKE operator किसलिए use होता है?", options: ["Exact match के लिए", "Pattern matching के लिए", "Numbers compare के लिए", "Tables join के लिए"], answer: 1 },
  { id: 26, question: "SQL में % wildcard का क्या मतलब है?", options: ["कोई एक character", "कोई भी characters", "Number", "Space"], answer: 1 },
  { id: 27, question: "DISTINCT keyword क्या करता है?", options: ["Data sort करता है", "Duplicate values हटाता है", "Data filter करता है", "Tables join करता है"], answer: 1 },
  { id: 28, question: "INT data type किसके लिए use होता है?", options: ["Text के लिए", "Decimal numbers के लिए", "Whole numbers के लिए", "Dates के लिए"], answer: 2 },
  { id: 29, question: "DELETE और DROP में क्या अंतर है?", options: ["कोई अंतर नहीं", "DELETE rows हटाता है, DROP table हटाता है", "DROP rows हटाता है, DELETE table हटाता है", "दोनों same हैं"], answer: 1 },
  { id: 30, question: "SQL में OR operator क्या करता है?", options: ["दोनों conditions सच होनी चाहिए", "कोई एक condition सच हो तो चलेगा", "Condition नकारता है", "Count करता है"], answer: 1 },
  { id: 31, question: "BETWEEN operator किसलिए use होता है?", options: ["दो values के बीच range check करने के लिए", "Tables join करने के लिए", "Data delete करने के लिए", "Column बनाने के लिए"], answer: 0 },
  { id: 32, question: "AS keyword SQL में क्या करता है?", options: ["Table delete करता है", "Column या result को alias नाम देता है", "Data sort करता है", "Table join करता है"], answer: 1 },
  { id: 33, question: "MIN() function क्या करता है?", options: ["Maximum value देता है", "Minimum value देता है", "Average देता है", "Sum देता है"], answer: 1 },
  { id: 34, question: "SQL में एक साथ कई rows INSERT करने के लिए क्या use होता है?", options: ["Multiple SELECT", "Multiple VALUES", "BULK INSERT only", "COPY command"], answer: 1 },
  { id: 35, question: "WHERE clause में NOT का क्या काम है?", options: ["Condition को true बनाता है", "Condition को नकारता है", "Sort करता है", "Join करता है"], answer: 1 },
  { id: 36, question: "FLOAT data type किसके लिए use होता है?", options: ["Text के लिए", "Whole numbers के लिए", "Decimal numbers के लिए", "Dates के लिए"], answer: 2 },
  { id: 37, question: "SQL query के अंत में क्या लगाते हैं?", options: ["Comma", "Colon", "Semicolon", "Period"], answer: 2 },
  { id: 38, question: "GROUP BY clause किसलिए use होता है?", options: ["Data filter करने के लिए", "Data को groups में बांटने के लिए", "Tables join करने के लिए", "Data delete करने के लिए"], answer: 1 },
  { id: 39, question: "TRUNCATE command क्या करता है?", options: ["Table delete करता है", "Table की सभी rows हटाता है लेकिन structure रहता है", "Data insert करता है", "Table rename करता है"], answer: 1 },
  { id: 40, question: "IN operator किसलिए use होता है?", options: ["Range check के लिए", "Multiple values में से match check करने के लिए", "Tables join करने के लिए", "Sort करने के लिए"], answer: 1 },
]

// ─────────────────────────────────────────
// SQL QUESTIONS — ENGLISH (40)
// ─────────────────────────────────────────
const sqlQuestionsEnglish = [
  { id: 1, question: "What is the full form of SQL?", options: ["Simple Query Language", "Structured Query Language", "System Query Language", "Standard Query Language"], answer: 1 },
  { id: 2, question: "Which command is used to retrieve data from a database?", options: ["INSERT", "UPDATE", "SELECT", "DELETE"], answer: 2 },
  { id: 3, question: "What is the WHERE clause used for?", options: ["To sort data", "To filter data based on a condition", "To create a table", "To delete data"], answer: 1 },
  { id: 4, question: "Which command is used to add new data into a database?", options: ["SELECT", "UPDATE", "DELETE", "INSERT"], answer: 3 },
  { id: 5, question: "Which command is used to change existing data in a database?", options: ["INSERT", "UPDATE", "SELECT", "CREATE"], answer: 1 },
  { id: 6, question: "Which clause is used to sort data in SQL?", options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"], answer: 2 },
  { id: 7, question: "Which function is used to count the number of rows?", options: ["SUM()", "AVG()", "COUNT()", "MAX()"], answer: 2 },
  { id: 8, question: "Which command is used to create a new table?", options: ["NEW TABLE", "CREATE TABLE", "MAKE TABLE", "ADD TABLE"], answer: 1 },
  { id: 9, question: "Which command is used to combine data from two tables?", options: ["MERGE", "COMBINE", "JOIN", "CONNECT"], answer: 2 },
  { id: 10, question: "What does * mean in SELECT * FROM students?", options: ["No data", "All columns", "First column", "Last column"], answer: 1 },
  { id: 11, question: "Which command is used to remove data from a database?", options: ["REMOVE", "DELETE", "DROP", "CLEAR"], answer: 1 },
  { id: 12, question: "What does ORDER BY DESC mean?", options: ["Smallest to largest", "Largest to smallest", "Random order", "Alphabetical"], answer: 1 },
  { id: 13, question: "Inside what are text values written in SQL?", options: ["Double quotes", "Single quotes", "Brackets", "Stars"], answer: 1 },
  { id: 14, question: "What is a PRIMARY KEY?", options: ["The largest value", "A column that uniquely identifies each row", "The first column", "A foreign key"], answer: 1 },
  { id: 15, question: "What does the AVG() function do?", options: ["Returns the largest value", "Returns the smallest value", "Calculates the average", "Counts rows"], answer: 2 },
  { id: 16, question: "Why is WHERE important in an UPDATE command?", options: ["For speed", "So only a specific row gets updated", "Because of syntax rules", "It is not important"], answer: 1 },
  { id: 17, question: "What is the VARCHAR data type used for?", options: ["For numbers", "For text", "For dates", "For booleans"], answer: 1 },
  { id: 18, question: "What does the MAX() function do?", options: ["Returns the minimum value", "Returns the maximum value", "Returns the average", "Counts rows"], answer: 1 },
  { id: 19, question: "What does the AND operator do in SQL?", options: ["Checks one condition", "Both conditions must be true", "At least one condition must be true", "Negates a condition"], answer: 1 },
  { id: 20, question: "What does INNER JOIN show?", options: ["Only records from the first table", "Only matching records from both tables", "All records", "Empty records"], answer: 1 },
  { id: 21, question: "What does the NOT NULL constraint mean?", options: ["Column can be zero", "Column cannot be left empty", "Column can be deleted", "Column is optional"], answer: 1 },
  { id: 22, question: "What does the SUM() function do?", options: ["Counts rows", "Returns the average", "Adds up all values in a column", "Returns the maximum"], answer: 2 },
  { id: 23, question: "How do you write a comment in SQL?", options: ["# comment", "// comment", "-- comment", "/* comment only */"], answer: 2 },
  { id: 24, question: "What does the DROP TABLE command do?", options: ["Empties the table", "Removes the table and all its data", "Renames the table", "Copies the table"], answer: 1 },
  { id: 25, question: "What is the LIKE operator used for?", options: ["For exact matching", "For pattern matching", "For comparing numbers", "For joining tables"], answer: 1 },
  { id: 26, question: "What does the % wildcard mean in SQL?", options: ["Any single character", "Any number of characters", "A number", "A space"], answer: 1 },
  { id: 27, question: "What does the DISTINCT keyword do?", options: ["Sorts data", "Removes duplicate values", "Filters data", "Joins tables"], answer: 1 },
  { id: 28, question: "What is the INT data type used for?", options: ["For text", "For decimal numbers", "For whole numbers", "For dates"], answer: 2 },
  { id: 29, question: "What is the difference between DELETE and DROP?", options: ["No difference", "DELETE removes rows, DROP removes the table", "DROP removes rows, DELETE removes the table", "Both are the same"], answer: 1 },
  { id: 30, question: "What does the OR operator do in SQL?", options: ["Both conditions must be true", "At least one condition must be true", "Negates a condition", "Counts rows"], answer: 1 },
  { id: 31, question: "What is the BETWEEN operator used for?", options: ["To check a range between two values", "To join tables", "To delete data", "To create columns"], answer: 0 },
  { id: 32, question: "What does the AS keyword do in SQL?", options: ["Deletes a table", "Gives a column or result an alias name", "Sorts data", "Joins tables"], answer: 1 },
  { id: 33, question: "What does the MIN() function do?", options: ["Returns the maximum value", "Returns the minimum value", "Returns the average", "Returns the sum"], answer: 1 },
  { id: 34, question: "How do you insert multiple rows at once in SQL?", options: ["Multiple SELECT", "Multiple VALUES", "BULK INSERT only", "COPY command"], answer: 1 },
  { id: 35, question: "What does NOT do in a WHERE clause?", options: ["Makes a condition true", "Negates a condition", "Sorts data", "Joins tables"], answer: 1 },
  { id: 36, question: "What is the FLOAT data type used for?", options: ["For text", "For whole numbers", "For decimal numbers", "For dates"], answer: 2 },
  { id: 37, question: "What do you put at the end of a SQL query?", options: ["Comma", "Colon", "Semicolon", "Period"], answer: 2 },
  { id: 38, question: "What is the GROUP BY clause used for?", options: ["To filter data", "To group data into categories", "To join tables", "To delete data"], answer: 1 },
  { id: 39, question: "What does the TRUNCATE command do?", options: ["Deletes the table", "Removes all rows but keeps the table structure", "Inserts data", "Renames the table"], answer: 1 },
  { id: 40, question: "What is the IN operator used for?", options: ["For range checking", "To check if a value matches any in a list", "To join tables", "To sort data"], answer: 1 },
]

// ─────────────────────────────────────────
// SQL QUESTIONS — MARATHI (40)
// ─────────────────────────────────────────
const sqlQuestionsMarathi = [
  { id: 1, question: "SQL चे पूर्ण नाव काय आहे?", options: ["Simple Query Language", "Structured Query Language", "System Query Language", "Standard Query Language"], answer: 1 },
  { id: 2, question: "Database मधून data काढण्यासाठी कोणता command वापरतात?", options: ["INSERT", "UPDATE", "SELECT", "DELETE"], answer: 2 },
  { id: 3, question: "WHERE clause कशासाठी वापरतात?", options: ["Data sort करण्यासाठी", "Condition नुसार data filter करण्यासाठी", "Table बनवण्यासाठी", "Data delete करण्यासाठी"], answer: 1 },
  { id: 4, question: "Database मध्ये नवीन data टाकण्यासाठी कोणता command वापरतात?", options: ["SELECT", "UPDATE", "DELETE", "INSERT"], answer: 3 },
  { id: 5, question: "Database मधील जुना data बदलण्यासाठी कोणता command वापरतात?", options: ["INSERT", "UPDATE", "SELECT", "CREATE"], answer: 1 },
  { id: 6, question: "SQL मध्ये data sort करण्यासाठी कोणता clause वापरतात?", options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"], answer: 2 },
  { id: 7, question: "Rows ची संख्या काढण्यासाठी कोणते function वापरतात?", options: ["SUM()", "AVG()", "COUNT()", "MAX()"], answer: 2 },
  { id: 8, question: "नवीन table बनवण्यासाठी कोणता command वापरतात?", options: ["NEW TABLE", "CREATE TABLE", "MAKE TABLE", "ADD TABLE"], answer: 1 },
  { id: 9, question: "दोन tables चा data एकत्र काढण्यासाठी कोणता command वापरतात?", options: ["MERGE", "COMBINE", "JOIN", "CONNECT"], answer: 2 },
  { id: 10, question: "SELECT * FROM students मध्ये * चा अर्थ काय आहे?", options: ["कोणताही data नाही", "सर्व columns", "पहिला column", "शेवटचा column"], answer: 1 },
  { id: 11, question: "Database मधून data हटवण्यासाठी कोणता command वापरतात?", options: ["REMOVE", "DELETE", "DROP", "CLEAR"], answer: 1 },
  { id: 12, question: "ORDER BY DESC चा अर्थ काय आहे?", options: ["लहानातून मोठ्याकडे", "मोठ्यातून लहानाकडे", "Random order", "Alphabetical"], answer: 1 },
  { id: 13, question: "SQL मध्ये text values कोणत्या quotes मध्ये लिहतात?", options: ["Double quotes", "Single quotes", "Brackets", "Stars"], answer: 1 },
  { id: 14, question: "PRIMARY KEY म्हणजे काय?", options: ["सर्वात मोठी value", "प्रत्येक row ला uniquely identify करणारा column", "पहिला column", "Foreign key"], answer: 1 },
  { id: 15, question: "AVG() function काय करते?", options: ["सर्वात मोठी value देते", "सर्वात लहान value देते", "Average काढते", "Count करते"], answer: 2 },
  { id: 16, question: "UPDATE command मध्ये WHERE का महत्त्वाचे आहे?", options: ["Speed साठी", "फक्त specific row update व्हावी म्हणून", "Syntax नियमामुळे", "महत्त्वाचे नाही"], answer: 1 },
  { id: 17, question: "VARCHAR data type कशासाठी वापरतात?", options: ["Numbers साठी", "Text साठी", "Dates साठी", "Boolean साठी"], answer: 1 },
  { id: 18, question: "MAX() function काय करते?", options: ["Minimum value देते", "Maximum value देते", "Average देते", "Count करते"], answer: 1 },
  { id: 19, question: "SQL मध्ये AND operator काय करतो?", options: ["एक condition check करतो", "दोन्ही conditions बरोबर असाव्यात", "कोणतीही एक condition बरोबर असावी", "Condition नाकारतो"], answer: 1 },
  { id: 20, question: "INNER JOIN काय दाखवतो?", options: ["फक्त पहिल्या table चे records", "दोन्ही tables मधील matching records", "सर्व records", "रिकामे records"], answer: 1 },
  { id: 21, question: "NOT NULL constraint चा अर्थ काय आहे?", options: ["Column zero असू शकतो", "Column रिकामा राहू शकत नाही", "Column delete होऊ शकतो", "Column optional आहे"], answer: 1 },
  { id: 22, question: "SUM() function काय करते?", options: ["Count करते", "Average देते", "सर्व values ची बेरीज देते", "Maximum देते"], answer: 2 },
  { id: 23, question: "SQL मध्ये comment कसा लिहतात?", options: ["# comment", "// comment", "-- comment", "/* comment only */"], answer: 2 },
  { id: 24, question: "DROP TABLE command काय करतो?", options: ["Table रिकामी करतो", "Table आणि त्यातील सर्व data हटवतो", "Table rename करतो", "Table copy करतो"], answer: 1 },
  { id: 25, question: "LIKE operator कशासाठी वापरतात?", options: ["Exact match साठी", "Pattern matching साठी", "Numbers compare साठी", "Tables join साठी"], answer: 1 },
  { id: 26, question: "SQL मध्ये % wildcard चा अर्थ काय आहे?", options: ["कोणताही एक character", "कोणतेही characters", "Number", "Space"], answer: 1 },
  { id: 27, question: "DISTINCT keyword काय करतो?", options: ["Data sort करतो", "Duplicate values हटवतो", "Data filter करतो", "Tables join करतो"], answer: 1 },
  { id: 28, question: "INT data type कशासाठी वापरतात?", options: ["Text साठी", "Decimal numbers साठी", "Whole numbers साठी", "Dates साठी"], answer: 2 },
  { id: 29, question: "DELETE आणि DROP मध्ये काय फरक आहे?", options: ["काहीच फरक नाही", "DELETE rows हटवतो, DROP table हटवतो", "DROP rows हटवतो, DELETE table हटवतो", "दोन्ही सारखेच"], answer: 1 },
  { id: 30, question: "SQL मध्ये OR operator काय करतो?", options: ["दोन्ही conditions बरोबर असाव्यात", "कोणतीही एक condition बरोबर असेल तरी चालेल", "Condition नाकारतो", "Count करतो"], answer: 1 },
  { id: 31, question: "BETWEEN operator कशासाठी वापरतात?", options: ["दोन values मधील range check साठी", "Tables join साठी", "Data delete साठी", "Column बनवण्यासाठी"], answer: 0 },
  { id: 32, question: "SQL मध्ये AS keyword काय करतो?", options: ["Table delete करतो", "Column किंवा result ला alias नाव देतो", "Data sort करतो", "Tables join करतो"], answer: 1 },
  { id: 33, question: "MIN() function काय करते?", options: ["Maximum value देते", "Minimum value देते", "Average देते", "Sum देते"], answer: 1 },
  { id: 34, question: "SQL मध्ये एकत्र अनेक rows INSERT करण्यासाठी काय वापरतात?", options: ["Multiple SELECT", "Multiple VALUES", "BULK INSERT only", "COPY command"], answer: 1 },
  { id: 35, question: "WHERE clause मध्ये NOT काय करतो?", options: ["Condition true बनवतो", "Condition नाकारतो", "Sort करतो", "Join करतो"], answer: 1 },
  { id: 36, question: "FLOAT data type कशासाठी वापरतात?", options: ["Text साठी", "Whole numbers साठी", "Decimal numbers साठी", "Dates साठी"], answer: 2 },
  { id: 37, question: "SQL query च्या शेवटी काय लावतात?", options: ["Comma", "Colon", "Semicolon", "Period"], answer: 2 },
  { id: 38, question: "GROUP BY clause कशासाठी वापरतात?", options: ["Data filter साठी", "Data groups मध्ये विभागण्यासाठी", "Tables join साठी", "Data delete साठी"], answer: 1 },
  { id: 39, question: "TRUNCATE command काय करतो?", options: ["Table delete करतो", "सर्व rows हटवतो पण table structure ठेवतो", "Data insert करतो", "Table rename करतो"], answer: 1 },
  { id: 40, question: "IN operator कशासाठी वापरतात?", options: ["Range check साठी", "List मधील कोणत्याही value शी match check साठी", "Tables join साठी", "Sort साठी"], answer: 1 },
]



// ─────────────────────────────────────────
// JAVASCRIPT QUESTIONS — HINDI (40)
// ─────────────────────────────────────────
const javascriptQuestions = [
  { id: 1, question: "JavaScript किसलिए use होती है?", options: ["Database के लिए", "Websites को interactive बनाने के लिए", "Server बनाने के लिए", "Images बनाने के लिए"], answer: 1 },
  { id: 2, question: "JavaScript में output दिखाने के लिए क्या use होता है?", options: ["print()", "echo()", "console.log()", "show()"], answer: 2 },
  { id: 3, question: "JavaScript में variable बनाने के लिए कौन सा keyword use होता है?", options: ["var only", "let only", "const only", "let, const, var"], answer: 3 },
  { id: 4, question: "JavaScript में array किसमें लिखी जाती है?", options: ["() brackets", "{} brackets", "[] brackets", "<> brackets"], answer: 2 },
  { id: 5, question: "JavaScript में object किसमें लिखा जाता है?", options: ["() brackets", "{} brackets", "[] brackets", "<> brackets"], answer: 1 },
  { id: 6, question: "JavaScript में function बनाने के लिए कौन सा keyword use होता है?", options: ["def", "func", "function", "method"], answer: 2 },
  { id: 7, question: "DOM का full form क्या है?", options: ["Data Object Model", "Document Object Model", "Display Object Model", "Dynamic Object Model"], answer: 1 },
  { id: 8, question: "JavaScript में for loop कैसे लिखते हैं?", options: ["for i in range()", "foreach()", "for (let i=0; i<5; i++)", "loop(5)"], answer: 2 },
  { id: 9, question: "const से बनाया variable बाद में बदल सकते हैं?", options: ["हाँ", "नहीं", "कभी कभी", "पता नहीं"], answer: 1 },
  { id: 10, question: "JavaScript में string जोड़ने के लिए कौन सा operator use होता है?", options: ["*", "-", "+", "/"], answer: 2 },
  { id: 11, question: "JavaScript में array की length कैसे निकालते हैं?", options: ["array.size()", "array.count()", "array.length", "len(array)"], answer: 2 },
  { id: 12, question: "JavaScript में नया item array में add करने के लिए क्या use होता है?", options: ["add()", "append()", "push()", "insert()"], answer: 2 },
  { id: 13, question: "Arrow function का syntax क्या होता है?", options: ["function() {}", "func() =>", "() => {}", "=> function()"], answer: 2 },
  { id: 14, question: "JavaScript में equality check के लिए कौन सा operator best है?", options: ["=", "==", "===", "!="], answer: 2 },
  { id: 15, question: "Template literal किससे बनता है?", options: ["Single quotes", "Double quotes", "Backticks", "Brackets"], answer: 2 },
  { id: 16, question: "JavaScript में typeof operator क्या करता है?", options: ["Value delete करता है", "Variable का type बताता है", "Value change करता है", "Variable create करता है"], answer: 1 },
  { id: 17, question: "getElementById() किसलिए use होता है?", options: ["CSS बदलने के लिए", "HTML element को id से ढूंढने के लिए", "Event add करने के लिए", "Array बनाने के लिए"], answer: 1 },
  { id: 18, question: "addEventListener क्या करता है?", options: ["Element delete करता है", "Event जैसे click सुनता है", "Style बदलता है", "Variable बनाता है"], answer: 1 },
  { id: 19, question: "JavaScript में if के साथ multiple conditions के लिए क्या use होता है?", options: ["elif", "elseif", "else if", "ifelse"], answer: 2 },
  { id: 20, question: "while loop कब तक चलता है?", options: ["एक बार", "पाँच बार", "जब तक condition true हो", "कभी नहीं"], answer: 2 },
  { id: 21, question: "JavaScript में forEach() क्या करता है?", options: ["Array create करता है", "Array के हर item पर function चलाता है", "Array delete करता है", "Array sort करता है"], answer: 1 },
  { id: 22, question: "map() method क्या करता है?", options: ["हर item transform करके नया array बनाता है", "Items filter करता है", "Items sort करता है", "Items delete करता है"], answer: 0 },
  { id: 23, question: "filter() method क्या करता है?", options: ["Items transform करता है", "Condition के हिसाब से items filter करता है", "Items sort करता है", "Array का length देता है"], answer: 1 },
  { id: 24, question: "JavaScript में null का मतलब क्या है?", options: ["Zero", "Undefined variable", "जानबूझकर खाली value", "Error"], answer: 2 },
  { id: 25, question: "JavaScript में object की property access करने के लिए क्या use होता है?", options: ["-> operator", ": operator", ". dot notation", "[] only"], answer: 2 },
  { id: 26, question: "break statement क्या करता है?", options: ["Loop को continue करता है", "Loop को बीच में बंद करता है", "Function return करता है", "Variable delete करता है"], answer: 1 },
  { id: 27, question: "continue statement क्या करता है?", options: ["Loop बंद करता है", "Current iteration skip करके अगले पर जाता है", "Function call करता है", "Error throw करता है"], answer: 1 },
  { id: 28, question: "JavaScript में string को number में convert करने के लिए क्या use होता है?", options: ["toString()", "parseInt()", "toNumber()", "convert()"], answer: 1 },
  { id: 29, question: "NaN का full form क्या है?", options: ["Not a Number", "Null and None", "New Array Node", "No Answer Now"], answer: 0 },
  { id: 30, question: "JavaScript में try/catch किसलिए use होता है?", options: ["Loop के लिए", "Errors handle करने के लिए", "Function बनाने के लिए", "Array sort करने के लिए"], answer: 1 },
  { id: 31, question: "innerHTML property क्या करती है?", options: ["CSS बदलती है", "Element का HTML content get या set करती है", "Event add करती है", "Element delete करती है"], answer: 1 },
  { id: 32, question: "JavaScript में number को string में convert करने के लिए क्या use होता है?", options: ["parseInt()", "toString()", "toArray()", "convert()"], answer: 1 },
  { id: 33, question: "Array से last item remove करने के लिए क्या use होता है?", options: ["push()", "shift()", "pop()", "remove()"], answer: 2 },
  { id: 34, question: "JavaScript में let और const में क्या अंतर है?", options: ["कोई अंतर नहीं", "let की value बदल सकती है, const की नहीं", "const की value बदल सकती है, let की नहीं", "दोनों same हैं"], answer: 1 },
  { id: 35, question: "querySelector() किसलिए use होता है?", options: ["CSS selector से element ढूंढने के लिए", "Array बनाने के लिए", "Function call करने के लिए", "Variable बनाने के लिए"], answer: 0 },
  { id: 36, question: "JavaScript में object method क्या होता है?", options: ["Object की property", "Object के अंदर का function", "Object का नाम", "Object की length"], answer: 1 },
  { id: 37, question: "JavaScript में boolean के कितने values होते हैं?", options: ["एक", "दो", "तीन", "चार"], answer: 1 },
  { id: 38, question: "sort() method क्या करता है?", options: ["Array में item add करता है", "Array को sort करता है", "Array delete करता है", "Array copy करता है"], answer: 1 },
  { id: 39, question: "JavaScript में this keyword क्या refer करता है?", options: ["Global variable", "Current object", "Parent function", "Browser window always"], answer: 1 },
  { id: 40, question: "find() method क्या करता है?", options: ["सभी matching items देता है", "पहला matching item देता है", "Items delete करता है", "Array sort करता है"], answer: 1 },
]

// ─────────────────────────────────────────
// JAVASCRIPT QUESTIONS — ENGLISH (40)
// ─────────────────────────────────────────
const javascriptQuestionsEnglish = [
  { id: 1, question: "What is JavaScript used for?", options: ["For databases", "To make websites interactive", "To build servers", "To create images"], answer: 1 },
  { id: 2, question: "What is used to show output in JavaScript?", options: ["print()", "echo()", "console.log()", "show()"], answer: 2 },
  { id: 3, question: "Which keywords are used to create variables in JavaScript?", options: ["var only", "let only", "const only", "let, const, var"], answer: 3 },
  { id: 4, question: "Inside which brackets is an array written in JavaScript?", options: ["() brackets", "{} brackets", "[] brackets", "<> brackets"], answer: 2 },
  { id: 5, question: "Inside which brackets is an object written in JavaScript?", options: ["() brackets", "{} brackets", "[] brackets", "<> brackets"], answer: 1 },
  { id: 6, question: "Which keyword is used to create a function in JavaScript?", options: ["def", "func", "function", "method"], answer: 2 },
  { id: 7, question: "What is the full form of DOM?", options: ["Data Object Model", "Document Object Model", "Display Object Model", "Dynamic Object Model"], answer: 1 },
  { id: 8, question: "How is a for loop written in JavaScript?", options: ["for i in range()", "foreach()", "for (let i=0; i<5; i++)", "loop(5)"], answer: 2 },
  { id: 9, question: "Can a variable created with const be changed later?", options: ["Yes", "No", "Sometimes", "Don't know"], answer: 1 },
  { id: 10, question: "Which operator is used to join strings in JavaScript?", options: ["*", "-", "+", "/"], answer: 2 },
  { id: 11, question: "How do you get the length of an array in JavaScript?", options: ["array.size()", "array.count()", "array.length", "len(array)"], answer: 2 },
  { id: 12, question: "What is used to add a new item to an array in JavaScript?", options: ["add()", "append()", "push()", "insert()"], answer: 2 },
  { id: 13, question: "What is the syntax of an arrow function?", options: ["function() {}", "func() =>", "() => {}", "=> function()"], answer: 2 },
  { id: 14, question: "Which equality operator is best practice in JavaScript?", options: ["=", "==", "===", "!="], answer: 2 },
  { id: 15, question: "What are template literals created with?", options: ["Single quotes", "Double quotes", "Backticks", "Brackets"], answer: 2 },
  { id: 16, question: "What does the typeof operator do in JavaScript?", options: ["Deletes a value", "Tells the type of a variable", "Changes a value", "Creates a variable"], answer: 1 },
  { id: 17, question: "What is getElementById() used for?", options: ["To change CSS", "To find an HTML element by its id", "To add an event", "To create an array"], answer: 1 },
  { id: 18, question: "What does addEventListener do?", options: ["Deletes an element", "Listens for events like clicks", "Changes a style", "Creates a variable"], answer: 1 },
  { id: 19, question: "What is used for multiple conditions with if in JavaScript?", options: ["elif", "elseif", "else if", "ifelse"], answer: 2 },
  { id: 20, question: "How long does a while loop run?", options: ["Once", "Five times", "As long as the condition is true", "Never"], answer: 2 },
  { id: 21, question: "What does forEach() do in JavaScript?", options: ["Creates an array", "Runs a function on every item in an array", "Deletes an array", "Sorts an array"], answer: 1 },
  { id: 22, question: "What does the map() method do?", options: ["Transforms every item and returns a new array", "Filters items", "Sorts items", "Deletes items"], answer: 0 },
  { id: 23, question: "What does the filter() method do?", options: ["Transforms items", "Filters items based on a condition", "Sorts items", "Returns array length"], answer: 1 },
  { id: 24, question: "What does null mean in JavaScript?", options: ["Zero", "Undefined variable", "An intentionally empty value", "Error"], answer: 2 },
  { id: 25, question: "What is used to access a property of an object in JavaScript?", options: ["-> operator", ": operator", ". dot notation", "[] only"], answer: 2 },
  { id: 26, question: "What does the break statement do?", options: ["Continues the loop", "Stops the loop immediately", "Returns from a function", "Deletes a variable"], answer: 1 },
  { id: 27, question: "What does the continue statement do?", options: ["Stops the loop", "Skips the current iteration and goes to the next", "Calls a function", "Throws an error"], answer: 1 },
  { id: 28, question: "What is used to convert a string to a number in JavaScript?", options: ["toString()", "parseInt()", "toNumber()", "convert()"], answer: 1 },
  { id: 29, question: "What is the full form of NaN?", options: ["Not a Number", "Null and None", "New Array Node", "No Answer Now"], answer: 0 },
  { id: 30, question: "What is try/catch used for in JavaScript?", options: ["For loops", "To handle errors", "To create functions", "To sort arrays"], answer: 1 },
  { id: 31, question: "What does the innerHTML property do?", options: ["Changes CSS", "Gets or sets the HTML content of an element", "Adds an event", "Deletes an element"], answer: 1 },
  { id: 32, question: "What is used to convert a number to a string in JavaScript?", options: ["parseInt()", "toString()", "toArray()", "convert()"], answer: 1 },
  { id: 33, question: "What is used to remove the last item from an array?", options: ["push()", "shift()", "pop()", "remove()"], answer: 2 },
  { id: 34, question: "What is the difference between let and const in JavaScript?", options: ["No difference", "let can be changed, const cannot", "const can be changed, let cannot", "Both are the same"], answer: 1 },
  { id: 35, question: "What is querySelector() used for?", options: ["To find an element using a CSS selector", "To create an array", "To call a function", "To create a variable"], answer: 0 },
  { id: 36, question: "What is a method in a JavaScript object?", options: ["A property of the object", "A function inside the object", "The name of the object", "The length of the object"], answer: 1 },
  { id: 37, question: "How many values does a boolean have in JavaScript?", options: ["One", "Two", "Three", "Four"], answer: 1 },
  { id: 38, question: "What does the sort() method do?", options: ["Adds items to an array", "Sorts an array", "Deletes an array", "Copies an array"], answer: 1 },
  { id: 39, question: "What does the this keyword refer to in JavaScript?", options: ["A global variable", "The current object", "The parent function", "The browser window always"], answer: 1 },
  { id: 40, question: "What does the find() method do?", options: ["Returns all matching items", "Returns the first matching item", "Deletes items", "Sorts the array"], answer: 1 },
]

// ─────────────────────────────────────────
// JAVASCRIPT QUESTIONS — MARATHI (40)
// ─────────────────────────────────────────
const javascriptQuestionsMarathi = [
  { id: 1, question: "JavaScript कशासाठी वापरतात?", options: ["Database साठी", "Websites interactive बनवण्यासाठी", "Server बनवण्यासाठी", "Images बनवण्यासाठी"], answer: 1 },
  { id: 2, question: "JavaScript मध्ये output दाखवण्यासाठी काय वापरतात?", options: ["print()", "echo()", "console.log()", "show()"], answer: 2 },
  { id: 3, question: "JavaScript मध्ये variable बनवण्यासाठी कोणते keywords वापरतात?", options: ["var only", "let only", "const only", "let, const, var"], answer: 3 },
  { id: 4, question: "JavaScript मध्ये array कोणत्या brackets मध्ये लिहतात?", options: ["() brackets", "{} brackets", "[] brackets", "<> brackets"], answer: 2 },
  { id: 5, question: "JavaScript मध्ये object कोणत्या brackets मध्ये लिहतात?", options: ["() brackets", "{} brackets", "[] brackets", "<> brackets"], answer: 1 },
  { id: 6, question: "JavaScript मध्ये function बनवण्यासाठी कोणता keyword वापरतात?", options: ["def", "func", "function", "method"], answer: 2 },
  { id: 7, question: "DOM चे पूर्ण नाव काय आहे?", options: ["Data Object Model", "Document Object Model", "Display Object Model", "Dynamic Object Model"], answer: 1 },
  { id: 8, question: "JavaScript मध्ये for loop कसा लिहतात?", options: ["for i in range()", "foreach()", "for (let i=0; i<5; i++)", "loop(5)"], answer: 2 },
  { id: 9, question: "const ने बनवलेला variable नंतर बदलता येतो का?", options: ["होय", "नाही", "कधी कधी", "माहीत नाही"], answer: 1 },
  { id: 10, question: "JavaScript मध्ये strings जोडण्यासाठी कोणता operator वापरतात?", options: ["*", "-", "+", "/"], answer: 2 },
  { id: 11, question: "JavaScript मध्ये array ची length कशी काढतात?", options: ["array.size()", "array.count()", "array.length", "len(array)"], answer: 2 },
  { id: 12, question: "Array मध्ये नवीन item add करण्यासाठी काय वापरतात?", options: ["add()", "append()", "push()", "insert()"], answer: 2 },
  { id: 13, question: "Arrow function चा syntax कोणता आहे?", options: ["function() {}", "func() =>", "() => {}", "=> function()"], answer: 2 },
  { id: 14, question: "JavaScript मध्ये equality check साठी कोणता operator best आहे?", options: ["=", "==", "===", "!="], answer: 2 },
  { id: 15, question: "Template literal कशाने बनतो?", options: ["Single quotes", "Double quotes", "Backticks", "Brackets"], answer: 2 },
  { id: 16, question: "JavaScript मध्ये typeof operator काय करतो?", options: ["Value delete करतो", "Variable चा type सांगतो", "Value बदलतो", "Variable बनवतो"], answer: 1 },
  { id: 17, question: "getElementById() कशासाठी वापरतात?", options: ["CSS बदलण्यासाठी", "HTML element ला id ने शोधण्यासाठी", "Event add करण्यासाठी", "Array बनवण्यासाठी"], answer: 1 },
  { id: 18, question: "addEventListener काय करतो?", options: ["Element delete करतो", "Click सारखे events ऐकतो", "Style बदलतो", "Variable बनवतो"], answer: 1 },
  { id: 19, question: "JavaScript मध्ये if सोबत multiple conditions साठी काय वापरतात?", options: ["elif", "elseif", "else if", "ifelse"], answer: 2 },
  { id: 20, question: "while loop किती वेळ चालतो?", options: ["एकदा", "पाच वेळा", "जोपर्यंत condition true असेल", "कधीही नाही"], answer: 2 },
  { id: 21, question: "JavaScript मध्ये forEach() काय करतो?", options: ["Array बनवतो", "Array च्या प्रत्येक item वर function चालवतो", "Array delete करतो", "Array sort करतो"], answer: 1 },
  { id: 22, question: "map() method काय करते?", options: ["प्रत्येक item transform करून नवीन array बनवते", "Items filter करते", "Items sort करते", "Items delete करते"], answer: 0 },
  { id: 23, question: "filter() method काय करते?", options: ["Items transform करते", "Condition नुसार items filter करते", "Items sort करते", "Array ची length देते"], answer: 1 },
  { id: 24, question: "JavaScript मध्ये null चा अर्थ काय आहे?", options: ["Zero", "Undefined variable", "जाणूनबुजून रिकामी value", "Error"], answer: 2 },
  { id: 25, question: "JavaScript मध्ये object ची property access करण्यासाठी काय वापरतात?", options: ["-> operator", ": operator", ". dot notation", "[] only"], answer: 2 },
  { id: 26, question: "break statement काय करतो?", options: ["Loop continue करतो", "Loop बीच में बंद करतो", "Function return करतो", "Variable delete करतो"], answer: 1 },
  { id: 27, question: "continue statement काय करतो?", options: ["Loop बंद करतो", "Current iteration skip करून पुढे जातो", "Function call करतो", "Error throw करतो"], answer: 1 },
  { id: 28, question: "JavaScript मध्ये string ला number मध्ये convert करण्यासाठी काय वापरतात?", options: ["toString()", "parseInt()", "toNumber()", "convert()"], answer: 1 },
  { id: 29, question: "NaN चे पूर्ण नाव काय आहे?", options: ["Not a Number", "Null and None", "New Array Node", "No Answer Now"], answer: 0 },
  { id: 30, question: "JavaScript मध्ये try/catch कशासाठी वापरतात?", options: ["Loop साठी", "Errors handle करण्यासाठी", "Function बनवण्यासाठी", "Array sort करण्यासाठी"], answer: 1 },
  { id: 31, question: "innerHTML property काय करते?", options: ["CSS बदलते", "Element चा HTML content get किंवा set करते", "Event add करते", "Element delete करते"], answer: 1 },
  { id: 32, question: "JavaScript मध्ये number ला string मध्ये convert करण्यासाठी काय वापरतात?", options: ["parseInt()", "toString()", "toArray()", "convert()"], answer: 1 },
  { id: 33, question: "Array मधील शेवटचा item remove करण्यासाठी काय वापरतात?", options: ["push()", "shift()", "pop()", "remove()"], answer: 2 },
  { id: 34, question: "JavaScript मध्ये let आणि const मध्ये काय फरक आहे?", options: ["काहीच फरक नाही", "let ची value बदलता येते, const ची नाही", "const ची value बदलता येते, let ची नाही", "दोन्ही सारखेच"], answer: 1 },
  { id: 35, question: "querySelector() कशासाठी वापरतात?", options: ["CSS selector ने element शोधण्यासाठी", "Array बनवण्यासाठी", "Function call साठी", "Variable बनवण्यासाठी"], answer: 0 },
  { id: 36, question: "JavaScript object मधील method म्हणजे काय?", options: ["Object ची property", "Object च्या आत असलेले function", "Object चे नाव", "Object ची length"], answer: 1 },
  { id: 37, question: "JavaScript मध्ये boolean ला किती values असतात?", options: ["एक", "दोन", "तीन", "चार"], answer: 1 },
  { id: 38, question: "sort() method काय करते?", options: ["Array मध्ये item add करते", "Array sort करते", "Array delete करते", "Array copy करते"], answer: 1 },
  { id: 39, question: "JavaScript मध्ये this keyword कशाला refer करतो?", options: ["Global variable", "Current object", "Parent function", "Browser window नेहमी"], answer: 1 },
  { id: 40, question: "find() method काय करते?", options: ["सर्व matching items देते", "पहिला matching item देते", "Items delete करते", "Array sort करते"], answer: 1 },
]






function MCQPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "दोस्त"
  const language = location.state?.language || "python"
  const instructionLang = location.state?.instructionLang || "hindi"  // ← define first
  const questions = instructionLang === "english"                      // ← then use it
  ? (language === "sql" ? sqlQuestionsEnglish : language === "javascript" ? javascriptQuestionsEnglish : pythonQuestionsEnglish)
  : instructionLang === "marathi"
  ? (language === "sql" ? sqlQuestionsMarathi : language === "javascript" ? javascriptQuestionsMarathi : pythonQuestionsMarathi)
  : (language === "sql" ? sqlQuestions : language === "javascript" ? javascriptQuestions : pythonQuestions)
  const lang = t[instructionLang]
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [step, setStep] = useState("intro")
  const [status, setStatus] = useState("")
  const [lastMessage, setLastMessage] = useState("")
  const [listening, setListening] = useState(false)
  const { theme, toggleTheme, bg, textColor, cardBg, cardBorder, mutedColor, codeBg, fontSize, setFontSize, speed, setSpeed } = useTheme()

function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage(text)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang.voiceLang
    utterance.rate = parseFloat(localStorage.getItem("speed") || "0.85")
    utterance.pitch = 1.0
    utterance.volume = 1

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(v =>
        v.name === "Google US English" && lang.voiceLang === "en-US" ||
        v.name === "Google हिन्दी" && lang.voiceLang === "hi-IN" ||
        v.lang === lang.voiceLang
      )
      if (preferred) utterance.voice = preferred
      if (onEnd) utterance.onend = onEnd
      window.speechSynthesis.speak(utterance)
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = trySpeak
    } else {
      trySpeak()
    }
  }

 useEffect(() => {
    setTimeout(() => {
      speak(
        lang.mcqWelcome(name) + " " +
        lang.pressQ + " " +
        lang.press1234 + " " +
        lang.pressR
      )
      setStatus("Q = " + lang.pressQ + " | 1,2,3,4 = जवाब | R = " + lang.repeatBtn)
      setStep("ready")
    }, 1000)
  }, [])

  function playQuestion() {
    const q = questions[current]
    let text = "Question " + q.id + ". " + q.question + ". "
    q.options.forEach((opt, i) => { text += (i + 1) + ". " + opt + ". " })
    text += "1, 2, 3, या 4 दबाएं जवाब देने के लिए।"
    speak(text)
    setStep("playing")
    setSelected(null)
    setStatus("सुनिए... 1, 2, 3, 4 = जवाब चुनें")
  }

  function selectAnswer(index) {
    if (step !== "playing") {
      speak("पहले Q दबाएं question सुनने के लिए")
      return
    }
    setSelected(index)
    const q = questions[current]
    const isCorrect = index === q.answer
    if (isCorrect) {
      setScore((prev) => prev + 1)
      speak(lang.correct + " " + lang.nextQ)
      setStatus("✅ " + lang.correct)
    } else {
      speak(lang.wrong(q.options[q.answer]) + " " + lang.nextQ)
      setStatus("❌ " + lang.wrong(q.options[q.answer]))
    }
    setStep("answered")
  }


  function nextQuestion() {
    if (step !== "answered") {
      speak("पहले जवाब दीजिए। 1, 2, 3, या 4 दबाएं।")
      return
    }
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1)
      setStep("ready")
      setSelected(null)
      speak("अगला question तैयार है। Q दबाएं सुनने के लिए।")
      setStatus("Q = Question सुनें")
    } else {
  localStorage.setItem("mcq_done", "true")
  setStep("done")
  const finalScore = score + (selected === questions[current].answer ? 1 : 0)
  localStorage.setItem("mcq_score", finalScore.toString())
  speak(
    "बहुत शाबाश " + name + "! आपने सभी " + questions.length + " questions पूरे किए। " +
    questions.length + " में से " + finalScore + " सही जवाब दिए। " +
    "N दबाएं Code Agent पर जाने के लिए।"
  )
  setStatus("🎉 Quiz पूरा! Score: " + finalScore + "/" + questions.length + " | N = Code Agent")
 }
}
  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = "hi-IN"
    recognition.start()
    setListening(true)
    setStatus("सुन रही हूँ...")
    recognition.onresult = (e) => {
      const answer = e.results[0][0].transcript.toLowerCase()
      setListening(false)
      if (answer.includes("एक") || answer.includes("1")) selectAnswer(0)
      else if (answer.includes("दो") || answer.includes("2")) selectAnswer(1)
      else if (answer.includes("तीन") || answer.includes("3")) selectAnswer(2)
      else if (answer.includes("चार") || answer.includes("4")) selectAnswer(3)
      else speak("कृपया एक, दो, तीन, या चार बोलिए")
    }
    recognition.onerror = () => {
      setListening(false)
      setStatus("सुनाई नहीं दिया")
    }
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === "INPUT") return
      const key = e.key.toLowerCase()
      if (key === "q") playQuestion()
      if (key === "1") selectAnswer(0)
      if (key === "2") selectAnswer(1)
      if (key === "3") selectAnswer(2)
      if (key === "4") selectAnswer(3)
      if (key === "r") speak(lastMessage)
      if (key === "n" && step === "done") navigate("/agent", { state: { name, language, instructionLang } })
      if (key === "n" && step !== "done") nextQuestion()
      if (key === "m") toggleTheme()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [current, step, lastMessage, score, selected])

  const q = questions[current]
  const progress = Math.round((current / questions.length) * 100)

  return (
    <main aria-label="MCQ Practice पृष्ठ" style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem" , fontSize: fontSize + "px"
    }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        <Navbar name={name} theme={theme} toggleTheme={toggleTheme} fontSize={fontSize} setFontSize={setFontSize} speed={speed} setSpeed={setSpeed} language={language} instructionLang={instructionLang} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>

          <div>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h1 style={{ color: "#a0a0ff", fontSize: "1.8rem", margin: "0" }}>
  {language === "sql" ? "🗄️ SQL" : language === "javascript" ? "🌐 JavaScript" : "🐍 Python"} MCQ
</h1>
              <p style={{ color: mutedColor, margin: "0.3rem 0 0" }}>नमस्ते {name}!</p>
            </div>

            <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "0.8rem 1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ color: mutedColor, fontSize: "0.85rem" }}>Progress</span>
                <span style={{ color: "#a0a0ff", fontSize: "0.85rem" }}>{current}/{questions.length} questions</span>
              </div>
              <div style={{ background: "#2a2a4e", borderRadius: "8px", height: "8px" }}>
                <div style={{ background: "#22c55e", width: progress + "%", height: "8px", borderRadius: "8px", transition: "width 0.5s" }} />
              </div>
            </div>

            <div aria-live="polite" style={{ background: cardBg, border: "1px solid " + cardBorder, padding: "1.5rem", borderRadius: "16px", marginBottom: "1rem" }}>
              <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>Question {q.id} of {questions.length}</p>
              <p style={{ color: textColor, fontSize: "1.1rem", fontWeight: "500", marginBottom: "1.2rem" }}>{q.question}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => selectAnswer(i)}
                    aria-label={(i + 1) + ". " + opt}
                    style={{
                      padding: "0.8rem 1rem", borderRadius: "10px", border: "1.5px solid",
                      textAlign: "left", cursor: "pointer", fontSize: "1rem",
                      background: selected === i ? (i === q.answer ? "#14532d" : "#450a0a") : cardBg,
                      borderColor: selected === i ? (i === q.answer ? "#22c55e" : "#ef4444") : cardBorder,
                      color: selected === i ? (i === q.answer ? "#22c55e" : "#ef4444") : textColor,
                      transition: "all 0.2s"
                    }}>
                    <span style={{ fontWeight: "bold", marginRight: "0.5rem", color: "#a0a0ff" }}>{i + 1}.</span>
                    {opt}
                  </button>
                ))}
              </div>
              {status !== "" && (
                <p aria-live="assertive" style={{ marginTop: "1rem", color: "#f4a261", fontSize: "0.9rem", background: "#2a1a0e", padding: "0.5rem 1rem", borderRadius: "8px" }}>{status}</p>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.8rem" }}>
              <button onClick={playQuestion} aria-label="Q — Question सुनें"
                style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#f4a261", color: "#000", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                🔊 सुनें<br /><span style={{ fontSize: "0.75rem" }}>(Q)</span>
              </button>
              <button onClick={() => speak(lastMessage)} aria-label="R — दोबारा सुनें"
                style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#4a4af4", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                🔁 दोबारा<br /><span style={{ fontSize: "0.75rem" }}>(R)</span>
              </button>
              <button onClick={startListening} disabled={listening} aria-label="T — आवाज़ से जवाब दें"
                style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: listening ? "#333" : "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                {listening ? "🎙️ सुन रही हूँ" : "🎤 बोलें"}<br /><span style={{ fontSize: "0.75rem" }}>(T)</span>
              </button>
              <button onClick={step === "done" ? () =>  navigate("/agent", { state: { name, language, instructionLang } }): nextQuestion}
                aria-label="N — अगला question"
                style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                {step === "done" ? "✅ Agent" : "अगला →"}<br /><span style={{ fontSize: "0.75rem" }}>(N)</span>
              </button>
            </div>
          </div>

          <div>
            <ProgressBar
              lessons={localStorage.getItem("lessons_done") === "true"}
              mcq={localStorage.getItem("mcq_done") === "true"}
              agent={localStorage.getItem("agent_visited") === "true"}
              theme={theme}
            />
            <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem" }}>
              <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem", textAlign: "center" }}>Keyboard Shortcuts</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {[["Q", "Question सुनें"], ["1-4", "जवाब चुनें"], ["R", "दोबारा सुनें"], ["T", "आवाज़ से जवाब"], ["N", "अगला question"], ["M", "Theme बदलें"], ["1", "Lessons page"], ["2", "MCQ page"], ["3", "Agent page"]].map(([key, desc]) => (
                  <div key={key} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span style={{ background: "#2a2a5e", color: "#a0a0ff", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold", fontSize: "0.9rem", minWidth: "28px", textAlign: "center" }}>{key}</span>
                    <span style={{ color: mutedColor, fontSize: "0.85rem" }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
   </main>
  )
}

export default MCQPage