import { t } from "../components/translations"
import Navbar from "../components/Navbar"
import { useTheme } from "../components/useTheme"
import { useState, useEffect } from "react"
import ProgressBar from "../components/ProgressBar"
import { useNavigate, useLocation } from "react-router-dom"

// ── all question arrays unchanged ──────────────────────────────────────────
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
]
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
]
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

const javaQuestions = [
  { id: 1, question: "Java किसने बनाया?", options: ["Dennis Ritchie", "James Gosling", "Guido van Rossum", "Bjarne Stroustrup"], answer: 1 },
  { id: 2, question: "Java कब बना?", options: ["1985", "1991", "1995", "2000"], answer: 2 },
  { id: 3, question: "Java का full form क्या है?", options: ["Just Another Virtual Application", "Java कोई abbreviation नहीं है", "Java Advanced Virtual Architecture", "Joint Application Virtual Adapter"], answer: 1 },
  { id: 4, question: "JVM का full form क्या है?", options: ["Java Virtual Memory", "Java Virtual Machine", "Java Variable Method", "Java Visual Model"], answer: 1 },
  { id: 5, question: "Java का principle क्या है?", options: ["Write Once Debug Everywhere", "Write Once Run Anywhere", "Write Many Run Once", "Write Fast Run Slow"], answer: 1 },
  { id: 6, question: "Java में screen पर print करने के लिए क्या use होता है?", options: ["console.log()", "print()", "System.out.println()", "echo()"], answer: 2 },
  { id: 7, question: "Java में पूरी संख्या store करने के लिए कौन सा data type use होता है?", options: ["float", "double", "int", "char"], answer: 2 },
  { id: 8, question: "Java में text store करने के लिए कौन सा data type use होता है?", options: ["text", "str", "String", "char"], answer: 2 },
  { id: 9, question: "Java में user से input लेने के लिए कौन सी class use होती है?", options: ["Input", "Reader", "Scanner", "BufferedReader only"], answer: 2 },
  { id: 10, question: "Java में हर statement के अंत में क्या लगाते हैं?", options: [".", ":", ";", ","], answer: 2 },
  { id: 11, question: "Java में class बनाने के लिए कौन सा keyword use होता है?", options: ["object", "class", "struct", "type"], answer: 1 },
  { id: 12, question: "Java में object बनाने के लिए कौन सा keyword use होता है?", options: ["create", "make", "new", "build"], answer: 2 },
  { id: 13, question: "Java में method बनाने के लिए कौन सा keyword जरूरी नहीं है?", options: ["public", "static", "void", "def"], answer: 3 },
  { id: 14, question: "Java में inheritance के लिए कौन सा keyword use होता है?", options: ["inherit", "extends", "implements", "super"], answer: 1 },
  { id: 15, question: "Java में array का index किससे शुरू होता है?", options: ["1", "0", "-1", "2"], answer: 1 },
  { id: 16, question: "Java में String compare करने के लिए क्या use करते हैं?", options: ["==", "===", ".equals()", ".compare()"], answer: 2 },
  { id: 17, question: "Java में exception handle करने के लिए क्या use होता है?", options: ["if/else", "try/catch", "for/while", "do/while"], answer: 1 },
  { id: 18, question: "ArrayList किस package में होता है?", options: ["java.lang", "java.io", "java.util", "java.net"], answer: 2 },
  { id: 19, question: "Java में method override करते समय कौन सा annotation use होता है?", options: ["@Overload", "@Override", "@Extend", "@Super"], answer: 1 },
  { id: 20, question: "Java में constructor का नाम क्या होता है?", options: ["Constructor", "Init", "Class के नाम जैसा", "Main"], answer: 2 },
  { id: 21, question: "Java में private field को बाहर से access करने के लिए क्या use होता है?", options: ["Direct access", "Getter/Setter methods", "Static methods", "Public field"], answer: 1 },
  { id: 22, question: "Java में ArrayList में element add करने के लिए कौन सा method use होता है?", options: ["insert()", "push()", "add()", "append()"], answer: 2 },
  { id: 23, question: "Java में for-each loop का syntax क्या है?", options: ["for (int i = 0; i < n; i++)", "for (Type item : collection)", "foreach (item in list)", "loop (item : list)"], answer: 1 },
  { id: 24, question: "Java में zero से divide करने पर कौन सी exception आती है?", options: ["NullPointerException", "NumberFormatException", "ArithmeticException", "ClassCastException"], answer: 2 },
  { id: 25, question: "Java में String की length निकालने के लिए क्या use होता है?", options: [".size()", ".count()", ".length()", ".len()"], answer: 2 },
  { id: 26, question: "Java में super keyword किसके लिए use होता है?", options: ["Child class refer करने के लिए", "Parent class refer करने के लिए", "Static method call करने के लिए", "Array बनाने के लिए"], answer: 1 },
  { id: 27, question: "Java में boolean data type की values क्या होती हैं?", options: ["0 और 1", "yes और no", "true और false", "on और off"], answer: 2 },
  { id: 28, question: "Java में Scanner से पूरी line read करने के लिए कौन सा method use होता है?", options: ["next()", "nextLine()", "read()", "readline()"], answer: 1 },
  { id: 29, question: "Java में finally block कब चलता है?", options: ["सिर्फ exception आने पर", "सिर्फ exception न आने पर", "हमेशा, exception आए या न आए", "कभी नहीं"], answer: 2 },
  { id: 30, question: "Java में char data type किसमें लिखते हैं?", options: ["Double quotes में", "Single quotes में", "Backticks में", "Square brackets में"], answer: 1 },
  { id: 31, question: "Java में method overloading क्या है?", options: ["Same method को दोबारा लिखना", "Same name के methods लेकिन different parameters", "Method delete करना", "Method rename करना"], answer: 1 },
  { id: 32, question: "Java में encapsulation का मतलब क्या है?", options: ["Code को copy करना", "Data को hide और protect करना", "Method को override करना", "Class को extend करना"], answer: 1 },
  { id: 33, question: "Java में static keyword का मतलब क्या है?", options: ["Method हमेशा run होगा", "Object बिना method call हो सकता है", "Method को delete नहीं कर सकते", "Variable का value fixed है"], answer: 1 },
  { id: 34, question: "Java में String को uppercase करने के लिए क्या use होता है?", options: [".upper()", ".toUpperCase()", ".UP()", ".capitalize()"], answer: 1 },
  { id: 35, question: "Java में Array की size कैसे पता चलती है?", options: [".size()", ".count()", ".length", ".len()"], answer: 2 },
  { id: 36, question: "Java में child class को और किस नाम से जानते हैं?", options: ["Parent class", "Superclass", "Subclass", "Base class"], answer: 2 },
  { id: 37, question: "Java में void का मतलब क्या है?", options: ["Method कुछ return करता है", "Method कुछ return नहीं करता", "Method private है", "Method static है"], answer: 1 },
  { id: 38, question: "Java में this keyword किसको refer करता है?", options: ["Parent class को", "Current object को", "Static method को", "Main method को"], answer: 1 },
  { id: 39, question: "Java में Collections.sort() किससे ArrayList sort करता है?", options: ["Descending order में", "Random order में", "Ascending order में", "Insertion order में"], answer: 2 },
  { id: 40, question: "Java में String.split() method क्या करता है?", options: ["String delete करता है", "String को parts में तोड़ता है", "String को reverse करता है", "String को uppercase करता है"], answer: 1 },
]

const javaQuestionsEnglish = [
  { id: 1, question: "Who created Java?", options: ["Dennis Ritchie", "James Gosling", "Guido van Rossum", "Bjarne Stroustrup"], answer: 1 },
  { id: 2, question: "In which year was Java created?", options: ["1985", "1991", "1995", "2000"], answer: 2 },
  { id: 3, question: "What does JVM stand for?", options: ["Java Virtual Memory", "Java Virtual Machine", "Java Variable Method", "Java Visual Model"], answer: 1 },
  { id: 4, question: "What is the main principle of Java?", options: ["Write Once Debug Everywhere", "Write Once Run Anywhere", "Write Many Run Once", "Write Fast Run Slow"], answer: 1 },
  { id: 5, question: "Which statement is used to print output in Java?", options: ["console.log()", "print()", "System.out.println()", "echo()"], answer: 2 },
  { id: 6, question: "Which data type stores whole numbers in Java?", options: ["float", "double", "int", "char"], answer: 2 },
  { id: 7, question: "Which data type stores text in Java?", options: ["text", "str", "String", "char"], answer: 2 },
  { id: 8, question: "Which class is used to take user input in Java?", options: ["Input", "Reader", "Scanner", "Keyboard"], answer: 2 },
  { id: 9, question: "What must be placed at the end of every statement in Java?", options: [".", ":", ";", ","], answer: 2 },
  { id: 10, question: "Which keyword is used to create a class in Java?", options: ["object", "class", "struct", "type"], answer: 1 },
  { id: 11, question: "Which keyword is used to create an object in Java?", options: ["create", "make", "new", "build"], answer: 2 },
  { id: 12, question: "Which keyword is used for inheritance in Java?", options: ["inherit", "extends", "implements", "super"], answer: 1 },
  { id: 13, question: "What index does a Java array start from?", options: ["1", "0", "-1", "2"], answer: 1 },
  { id: 14, question: "How do you correctly compare two Strings in Java?", options: ["==", "===", ".equals()", ".compare()"], answer: 2 },
  { id: 15, question: "Which block is used to handle exceptions in Java?", options: ["if/else", "try/catch", "for/while", "do/while"], answer: 1 },
  { id: 16, question: "Which package contains ArrayList?", options: ["java.lang", "java.io", "java.util", "java.net"], answer: 2 },
  { id: 17, question: "Which annotation is used when overriding a method in Java?", options: ["@Overload", "@Override", "@Extend", "@Super"], answer: 1 },
  { id: 18, question: "What is the name of a constructor in Java?", options: ["Constructor", "Init", "Same as the class name", "Main"], answer: 2 },
  { id: 19, question: "How do you access a private field from outside a class in Java?", options: ["Direct access", "Getter and Setter methods", "Static methods only", "Make it public"], answer: 1 },
  { id: 20, question: "Which method adds an element to an ArrayList in Java?", options: ["insert()", "push()", "add()", "append()"], answer: 2 },
  { id: 21, question: "What is the correct syntax for a for-each loop in Java?", options: ["for (int i = 0; i < n; i++)", "for (Type item : collection)", "foreach (item in list)", "loop (item : list)"], answer: 1 },
  { id: 22, question: "Which exception is thrown when dividing by zero in Java?", options: ["NullPointerException", "NumberFormatException", "ArithmeticException", "ClassCastException"], answer: 2 },
  { id: 23, question: "Which method returns the length of a String in Java?", options: [".size()", ".count()", ".length()", ".len()"], answer: 2 },
  { id: 24, question: "What is the super keyword used for in Java?", options: ["To refer to the child class", "To refer to the parent class", "To call a static method", "To create an array"], answer: 1 },
  { id: 25, question: "What are the two possible values of the boolean data type in Java?", options: ["0 and 1", "yes and no", "true and false", "on and off"], answer: 2 },
  { id: 26, question: "Which Scanner method reads a full line of input in Java?", options: ["next()", "nextLine()", "read()", "readline()"], answer: 1 },
  { id: 27, question: "When does the finally block run in Java?", options: ["Only when an exception occurs", "Only when no exception occurs", "Always, whether or not an exception occurs", "Never"], answer: 2 },
  { id: 28, question: "Inside which quotes is a char value written in Java?", options: ["Double quotes", "Single quotes", "Backticks", "Square brackets"], answer: 1 },
  { id: 29, question: "What is method overloading in Java?", options: ["Writing the same method twice", "Multiple methods with the same name but different parameters", "Deleting a method", "Renaming a method"], answer: 1 },
  { id: 30, question: "What does encapsulation mean in Java?", options: ["Copying code", "Hiding and protecting data", "Overriding a method", "Extending a class"], answer: 1 },
  { id: 31, question: "What does the static keyword mean in Java?", options: ["Method always runs", "Method can be called without creating an object", "Method cannot be deleted", "Variable value is fixed"], answer: 1 },
  { id: 32, question: "Which method converts a String to uppercase in Java?", options: [".upper()", ".toUpperCase()", ".UP()", ".capitalize()"], answer: 1 },
  { id: 33, question: "How do you find the size of an array in Java?", options: [".size()", ".count()", ".length", ".len()"], answer: 2 },
  { id: 34, question: "What is another name for a child class in Java?", options: ["Parent class", "Superclass", "Subclass", "Base class"], answer: 2 },
  { id: 35, question: "What does void mean in Java?", options: ["The method returns something", "The method returns nothing", "The method is private", "The method is static"], answer: 1 },
  { id: 36, question: "What does the this keyword refer to in Java?", options: ["The parent class", "The current object", "A static method", "The main method"], answer: 1 },
  { id: 37, question: "In which order does Collections.sort() sort an ArrayList?", options: ["Descending", "Random", "Ascending", "Insertion"], answer: 2 },
  { id: 38, question: "What does the String.split() method do in Java?", options: ["Deletes the string", "Breaks the string into parts", "Reverses the string", "Converts the string to uppercase"], answer: 1 },
  { id: 39, question: "What does the new keyword do in Java?", options: ["Creates a new variable", "Creates a new object in memory", "Creates a new method", "Creates a new class"], answer: 1 },
  { id: 40, question: "Which of these is NOT a Java primitive data type?", options: ["int", "boolean", "String", "char"], answer: 2 },
]

const javaQuestionsMarathi = [
  { id: 1, question: "Java कोणी बनवली?", options: ["Dennis Ritchie", "James Gosling", "Guido van Rossum", "Bjarne Stroustrup"], answer: 1 },
  { id: 2, question: "Java कोणत्या वर्षी बनवली गेली?", options: ["1985", "1991", "1995", "2000"], answer: 2 },
  { id: 3, question: "JVM चे पूर्ण नाव काय आहे?", options: ["Java Virtual Memory", "Java Virtual Machine", "Java Variable Method", "Java Visual Model"], answer: 1 },
  { id: 4, question: "Java चे मुख्य principle काय आहे?", options: ["Write Once Debug Everywhere", "Write Once Run Anywhere", "Write Many Run Once", "Write Fast Run Slow"], answer: 1 },
  { id: 5, question: "Java मध्ये screen वर print करण्यासाठी काय वापरतात?", options: ["console.log()", "print()", "System.out.println()", "echo()"], answer: 2 },
  { id: 6, question: "Java मध्ये पूर्ण संख्या store करण्यासाठी कोणता data type वापरतात?", options: ["float", "double", "int", "char"], answer: 2 },
  { id: 7, question: "Java मध्ये text store करण्यासाठी कोणता data type वापरतात?", options: ["text", "str", "String", "char"], answer: 2 },
  { id: 8, question: "Java मध्ये user कडून input घेण्यासाठी कोणती class वापरतात?", options: ["Input", "Reader", "Scanner", "Keyboard"], answer: 2 },
  { id: 9, question: "Java मध्ये प्रत्येक statement च्या शेवटी काय लावतात?", options: [".", ":", ";", ","], answer: 2 },
  { id: 10, question: "Java मध्ये class बनवण्यासाठी कोणता keyword वापरतात?", options: ["object", "class", "struct", "type"], answer: 1 },
  { id: 11, question: "Java मध्ये object बनवण्यासाठी कोणता keyword वापरतात?", options: ["create", "make", "new", "build"], answer: 2 },
  { id: 12, question: "Java मध्ये inheritance साठी कोणता keyword वापरतात?", options: ["inherit", "extends", "implements", "super"], answer: 1 },
  { id: 13, question: "Java मध्ये array चा index कोणत्या आकड्यापासून सुरू होतो?", options: ["1", "0", "-1", "2"], answer: 1 },
  { id: 14, question: "Java मध्ये दोन Strings compare करण्यासाठी काय वापरतात?", options: ["==", "===", ".equals()", ".compare()"], answer: 2 },
  { id: 15, question: "Java मध्ये exception handle करण्यासाठी काय वापरतात?", options: ["if/else", "try/catch", "for/while", "do/while"], answer: 1 },
  { id: 16, question: "ArrayList कोणत्या package मध्ये आहे?", options: ["java.lang", "java.io", "java.util", "java.net"], answer: 2 },
  { id: 17, question: "Java मध्ये method override करताना कोणता annotation वापरतात?", options: ["@Overload", "@Override", "@Extend", "@Super"], answer: 1 },
  { id: 18, question: "Java मध्ये constructor चे नाव काय असते?", options: ["Constructor", "Init", "Class च्या नावासारखे", "Main"], answer: 2 },
  { id: 19, question: "Java मध्ये private field ला बाहेरून access करण्यासाठी काय वापरतात?", options: ["Direct access", "Getter आणि Setter methods", "फक्त Static methods", "Public करणे"], answer: 1 },
  { id: 20, question: "Java मध्ये ArrayList मध्ये element add करण्यासाठी कोणती method वापरतात?", options: ["insert()", "push()", "add()", "append()"], answer: 2 },
  { id: 21, question: "Java मध्ये for-each loop चा योग्य syntax कोणता आहे?", options: ["for (int i = 0; i < n; i++)", "for (Type item : collection)", "foreach (item in list)", "loop (item : list)"], answer: 1 },
  { id: 22, question: "Java मध्ये zero ने divide केल्यावर कोणती exception येते?", options: ["NullPointerException", "NumberFormatException", "ArithmeticException", "ClassCastException"], answer: 2 },
  { id: 23, question: "Java मध्ये String ची length कशी काढतात?", options: [".size()", ".count()", ".length()", ".len()"], answer: 2 },
  { id: 24, question: "Java मध्ये super keyword कशासाठी वापरतात?", options: ["Child class refer करण्यासाठी", "Parent class refer करण्यासाठी", "Static method call करण्यासाठी", "Array बनवण्यासाठी"], answer: 1 },
  { id: 25, question: "Java मध्ये boolean data type च्या values कोणत्या आहेत?", options: ["0 आणि 1", "yes आणि no", "true आणि false", "on आणि off"], answer: 2 },
  { id: 26, question: "Java मध्ये Scanner ने पूर्ण line read करण्यासाठी कोणती method वापरतात?", options: ["next()", "nextLine()", "read()", "readline()"], answer: 1 },
  { id: 27, question: "Java मध्ये finally block कधी चालतो?", options: ["फक्त exception आल्यावर", "फक्त exception न आल्यावर", "नेहमी, exception असो किंवा नसो", "कधीही नाही"], answer: 2 },
  { id: 28, question: "Java मध्ये char value कोणत्या quotes मध्ये लिहतात?", options: ["Double quotes मध्ये", "Single quotes मध्ये", "Backticks मध्ये", "Square brackets मध्ये"], answer: 1 },
  { id: 29, question: "Java मध्ये method overloading म्हणजे काय?", options: ["Same method दोनदा लिहणे", "Same नावाचे methods पण वेगळे parameters", "Method delete करणे", "Method rename करणे"], answer: 1 },
  { id: 30, question: "Java मध्ये encapsulation चा अर्थ काय आहे?", options: ["Code copy करणे", "Data hide आणि protect करणे", "Method override करणे", "Class extend करणे"], answer: 1 },
  { id: 31, question: "Java मध्ये static keyword चा अर्थ काय आहे?", options: ["Method नेहमी run होतो", "Object न बनवता method call करता येतो", "Method delete करता येत नाही", "Variable ची value fixed आहे"], answer: 1 },
  { id: 32, question: "Java मध्ये String uppercase करण्यासाठी काय वापरतात?", options: [".upper()", ".toUpperCase()", ".UP()", ".capitalize()"], answer: 1 },
  { id: 33, question: "Java मध्ये array ची size कशी कळते?", options: [".size()", ".count()", ".length", ".len()"], answer: 2 },
  { id: 34, question: "Java मध्ये child class ला दुसऱ्या कोणत्या नावाने ओळखतात?", options: ["Parent class", "Superclass", "Subclass", "Base class"], answer: 2 },
  { id: 35, question: "Java मध्ये void चा अर्थ काय आहे?", options: ["Method काहीतरी return करतो", "Method काही return करत नाही", "Method private आहे", "Method static आहे"], answer: 1 },
  { id: 36, question: "Java मध्ये this keyword कशाला refer करतो?", options: ["Parent class ला", "Current object ला", "Static method ला", "Main method ला"], answer: 1 },
  { id: 37, question: "Collections.sort() ArrayList कोणत्या order मध्ये sort करतो?", options: ["Descending order मध्ये", "Random order मध्ये", "Ascending order मध्ये", "Insertion order मध्ये"], answer: 2 },
  { id: 38, question: "Java मध्ये String.split() method काय करते?", options: ["String delete करते", "String चे parts करते", "String reverse करते", "String uppercase करते"], answer: 1 },
  { id: 39, question: "Java मध्ये new keyword काय करतो?", options: ["नवीन variable बनवतो", "Memory मध्ये नवीन object बनवतो", "नवीन method बनवतो", "नवीन class बनवतो"], answer: 1 },
  { id: 40, question: "यापैकी Java चा primitive data type कोणता नाही?", options: ["int", "boolean", "String", "char"], answer: 2 },
]

const cppQuestions = [
  { id: 1, question: "C++ किसने बनाया?", options: ["James Gosling", "Dennis Ritchie", "Bjarne Stroustrup", "Guido van Rossum"], answer: 2 },
  { id: 2, question: "C++ कब बना?", options: ["1972", "1979", "1991", "1995"], answer: 1 },
  { id: 3, question: "C++ में output के लिए क्या use होता है?", options: ["print()", "System.out.println()", "cout", "console.log()"], answer: 2 },
  { id: 4, question: "C++ में input के लिए क्या use होता है?", options: ["scanf()", "cin", "input()", "readline()"], answer: 1 },
  { id: 5, question: "C++ में iostream header किसलिए use होता है?", options: ["Math के लिए", "Input/Output के लिए", "String के लिए", "Memory के लिए"], answer: 1 },
  { id: 6, question: "C++ में new keyword किसलिए use होता है?", options: ["Variable बनाने के लिए", "Dynamic memory allocate करने के लिए", "Function बनाने के लिए", "Class बनाने के लिए"], answer: 1 },
  { id: 7, question: "C++ में memory free करने के लिए क्या use होता है?", options: ["free()", "remove()", "delete", "clear()"], answer: 2 },
  { id: 8, question: "C++ में pointer किसके लिए होता है?", options: ["Value store करने के लिए", "Memory address store करने के लिए", "Function call करने के लिए", "Array बनाने के लिए"], answer: 1 },
  { id: 9, question: "C++ में & operator क्या देता है?", options: ["Value", "Memory address", "Size", "Type"], answer: 1 },
  { id: 10, question: "C++ में * operator pointer के साथ क्या करता है?", options: ["Address देता है", "Value access करता है (dereference)", "Multiply करता है", "Delete करता है"], answer: 1 },
  { id: 11, question: "C++ में class के default access specifier क्या होता है?", options: ["public", "protected", "private", "static"], answer: 2 },
  { id: 12, question: "C++ में struct के default access specifier क्या होता है?", options: ["private", "protected", "public", "static"], answer: 2 },
  { id: 13, question: "C++ में destructor का नाम कैसा होता है?", options: ["~ClassName", "delete_ClassName", "ClassName_destroy", "free_ClassName"], answer: 0 },
  { id: 14, question: "C++ में inheritance के लिए कौन सा keyword use होता है?", options: ["extends", "inherits", ":", "->"], answer: 2 },
  { id: 15, question: "C++ में virtual function किसलिए use होता है?", options: ["Static binding के लिए", "Runtime polymorphism के लिए", "Memory save करने के लिए", "Speed बढ़ाने के लिए"], answer: 1 },
  { id: 16, question: "STL का full form क्या है?", options: ["Standard Type Library", "Standard Template Library", "Static Template Library", "System Template Library"], answer: 1 },
  { id: 17, question: "C++ में vector किस प्रकार का data structure है?", options: ["Fixed size array", "Dynamic array", "Linked list", "Tree"], answer: 1 },
  { id: 18, question: "C++ में vector में element add करने के लिए क्या use होता है?", options: ["add()", "insert()", "push_back()", "append()"], answer: 2 },
  { id: 19, question: "C++ में map किस प्रकार का data store करता है?", options: ["Single values", "Key-value pairs", "Only integers", "Only strings"], answer: 1 },
  { id: 20, question: "C++ में template किसलिए use होता है?", options: ["HTML बनाने के लिए", "Generic programming के लिए", "File read करने के लिए", "Memory delete करने के लिए"], answer: 1 },
  { id: 21, question: "C++ में ofstream किसलिए use होता है?", options: ["File read करने के लिए", "File write करने के लिए", "File delete करने के लिए", "File copy करने के लिए"], answer: 1 },
  { id: 22, question: "C++ में ifstream किसलिए use होता है?", options: ["File write करने के लिए", "File read करने के लिए", "File create करने के लिए", "File rename करने के लिए"], answer: 1 },
  { id: 23, question: "C++ में endl क्या करता है?", options: ["Program बंद करता है", "नई line पर जाता है", "Error देता है", "Input लेता है"], answer: 1 },
  { id: 24, question: "C++ में do-while loop कम से कम कितनी बार चलता है?", options: ["0 बार", "1 बार", "2 बार", "5 बार"], answer: 1 },
  { id: 25, question: "C++ में pure virtual function कैसे declare होता है?", options: ["virtual void func()", "void func() = 0", "virtual void func() = 0", "abstract void func()"], answer: 2 },
  { id: 26, question: "C++ में const keyword क्या करता है?", options: ["Variable को delete करता है", "Variable की value fix करता है", "Variable को public बनाता है", "Variable को fast बनाता है"], answer: 1 },
  { id: 27, question: "C++ में using namespace std क्यों लिखते हैं?", options: ["Program fast होता है", "हर बार std:: नहीं लिखना पड़ता", "Memory बचती है", "Errors कम होती हैं"], answer: 1 },
  { id: 28, question: "C++ में range-based for loop कब आया?", options: ["C++98", "C++03", "C++11", "C++17"], answer: 2 },
  { id: 29, question: "C++ में method overriding में कौन सा keyword use होता है?", options: ["@Override", "override", "virtual", "super"], answer: 1 },
  { id: 30, question: "C++ में getline() किसलिए use होता है?", options: ["Integer read करने के लिए", "पूरी line read करने के लिए", "File open करने के लिए", "Output देने के लिए"], answer: 1 },
  { id: 31, question: "C++ में return 0 का मतलब क्या है?", options: ["Program fail हुआ", "Program successfully खत्म हुआ", "कुछ नहीं return होता", "Program restart होता है"], answer: 1 },
  { id: 32, question: "C++ में multiple inheritance क्या है?", options: ["एक class से कई बार inherit करना", "एक class का कई classes से inherit करना", "Class copy करना", "Method override करना"], answer: 1 },
  { id: 33, question: "C++ में sort() function किस header में होता है?", options: ["iostream", "string", "algorithm", "vector"], answer: 2 },
  { id: 34, question: "C++ में this pointer किसको refer करता है?", options: ["Parent class को", "Current object को", "Static variable को", "Main function को"], answer: 1 },
  { id: 35, question: "C++ में abstract class का object बन सकता है?", options: ["हाँ", "नहीं", "कभी-कभी", "Depends करता है"], answer: 1 },
  { id: 36, question: "C++ में float के बाद f क्यों लिखते हैं?", options: ["Fast execution के लिए", "Float literal को double से अलग करने के लिए", "File के लिए", "Function के लिए"], answer: 1 },
  { id: 37, question: "C++ में vector का size कैसे पता चलता है?", options: [".length()", ".count()", ".size()", ".len()"], answer: 2 },
  { id: 38, question: "C++ में auto keyword क्या करता है?", options: ["Variable automatically delete होता है", "Compiler automatically type detect करता है", "Variable automatic increment होता है", "Function automatically call होता है"], answer: 1 },
  { id: 39, question: "C++ में pass by reference कैसे होता है?", options: ["Function में value copy जाती है", "Function में & से original variable जाता है", "Function में pointer जाता है", "Function में array जाता है"], answer: 1 },
  { id: 40, question: "C++ में compiled language का क्या मतलब है?", options: ["Code browser में चलता है", "Code पहले machine code में convert होता है फिर run होता है", "Code interpret होता है line by line", "Code automatically fix होता है"], answer: 1 },
]

const cppQuestionsEnglish = [
  { id: 1, question: "Who created C++?", options: ["James Gosling", "Dennis Ritchie", "Bjarne Stroustrup", "Guido van Rossum"], answer: 2 },
  { id: 2, question: "In which year was C++ created?", options: ["1972", "1979", "1991", "1995"], answer: 1 },
  { id: 3, question: "Which statement is used for output in C++?", options: ["print()", "System.out.println()", "cout", "console.log()"], answer: 2 },
  { id: 4, question: "Which statement is used for input in C++?", options: ["scanf()", "cin", "input()", "readline()"], answer: 1 },
  { id: 5, question: "What is the iostream header used for in C++?", options: ["For math", "For input and output", "For strings", "For memory"], answer: 1 },
  { id: 6, question: "What is the new keyword used for in C++?", options: ["To create a variable", "To allocate dynamic memory", "To create a function", "To create a class"], answer: 1 },
  { id: 7, question: "Which keyword is used to free memory in C++?", options: ["free()", "remove()", "delete", "clear()"], answer: 2 },
  { id: 8, question: "What does a pointer store in C++?", options: ["A value", "A memory address", "A function call", "An array"], answer: 1 },
  { id: 9, question: "What does the & operator return in C++?", options: ["Value", "Memory address", "Size", "Type"], answer: 1 },
  { id: 10, question: "What does the * operator do with a pointer in C++?", options: ["Returns the address", "Accesses the value (dereferences)", "Multiplies", "Deletes"], answer: 1 },
  { id: 11, question: "What is the default access specifier of a class in C++?", options: ["public", "protected", "private", "static"], answer: 2 },
  { id: 12, question: "What is the default access specifier of a struct in C++?", options: ["private", "protected", "public", "static"], answer: 2 },
  { id: 13, question: "What is the naming convention for a destructor in C++?", options: ["~ClassName", "delete_ClassName", "ClassName_destroy", "free_ClassName"], answer: 0 },
  { id: 14, question: "Which syntax is used for inheritance in C++?", options: ["extends", "inherits", "colon :", "->"], answer: 2 },
  { id: 15, question: "What is a virtual function used for in C++?", options: ["Static binding", "Runtime polymorphism", "Saving memory", "Increasing speed"], answer: 1 },
  { id: 16, question: "What does STL stand for in C++?", options: ["Standard Type Library", "Standard Template Library", "Static Template Library", "System Template Library"], answer: 1 },
  { id: 17, question: "What type of data structure is a vector in C++?", options: ["Fixed size array", "Dynamic array", "Linked list", "Tree"], answer: 1 },
  { id: 18, question: "Which method adds an element to a vector in C++?", options: ["add()", "insert()", "push_back()", "append()"], answer: 2 },
  { id: 19, question: "What type of data does a map store in C++?", options: ["Single values", "Key-value pairs", "Only integers", "Only strings"], answer: 1 },
  { id: 20, question: "What are templates used for in C++?", options: ["Creating HTML", "Generic programming", "Reading files", "Deleting memory"], answer: 1 },
  { id: 21, question: "What is ofstream used for in C++?", options: ["Reading a file", "Writing to a file", "Deleting a file", "Copying a file"], answer: 1 },
  { id: 22, question: "What is ifstream used for in C++?", options: ["Writing to a file", "Reading from a file", "Creating a file", "Renaming a file"], answer: 1 },
  { id: 23, question: "What does endl do in C++?", options: ["Ends the program", "Moves to a new line", "Causes an error", "Takes input"], answer: 1 },
  { id: 24, question: "How many times does a do-while loop run at minimum in C++?", options: ["0 times", "1 time", "2 times", "5 times"], answer: 1 },
  { id: 25, question: "How is a pure virtual function declared in C++?", options: ["virtual void func()", "void func() = 0", "virtual void func() = 0", "abstract void func()"], answer: 2 },
  { id: 26, question: "What does the const keyword do in C++?", options: ["Deletes the variable", "Fixes the variable value so it cannot change", "Makes the variable public", "Makes the variable faster"], answer: 1 },
  { id: 27, question: "Why do we write using namespace std in C++?", options: ["Makes the program faster", "Avoids writing std:: before every command", "Saves memory", "Reduces errors"], answer: 1 },
  { id: 28, question: "In which version was the range-based for loop introduced in C++?", options: ["C++98", "C++03", "C++11", "C++17"], answer: 2 },
  { id: 29, question: "Which keyword is used when overriding a method in C++?", options: ["@Override", "override", "virtual", "super"], answer: 1 },
  { id: 30, question: "What is getline() used for in C++?", options: ["Reading an integer", "Reading a full line of text", "Opening a file", "Printing output"], answer: 1 },
  { id: 31, question: "What does return 0 mean at the end of main() in C++?", options: ["Program failed", "Program ended successfully", "Nothing is returned", "Program restarts"], answer: 1 },
  { id: 32, question: "What is multiple inheritance in C++?", options: ["Inheriting from the same class multiple times", "One class inheriting from more than one class", "Copying a class", "Overriding a method"], answer: 1 },
  { id: 33, question: "Which header file contains the sort() function in C++?", options: ["iostream", "string", "algorithm", "vector"], answer: 2 },
  { id: 34, question: "What does the this pointer refer to in C++?", options: ["The parent class", "The current object", "A static variable", "The main function"], answer: 1 },
  { id: 35, question: "Can you create an object of an abstract class in C++?", options: ["Yes", "No", "Sometimes", "Depends"], answer: 1 },
  { id: 36, question: "Why do we write f after a float literal in C++?", options: ["For fast execution", "To distinguish float from double", "For file operations", "For functions"], answer: 1 },
  { id: 37, question: "How do you find the size of a vector in C++?", options: [".length()", ".count()", ".size()", ".len()"], answer: 2 },
  { id: 38, question: "What does the auto keyword do in C++?", options: ["Variable is deleted automatically", "Compiler automatically detects the type", "Variable auto-increments", "Function is called automatically"], answer: 1 },
  { id: 39, question: "How does pass by reference work in C++?", options: ["A copy of the value is passed", "The original variable is passed using &", "A pointer is passed", "An array is passed"], answer: 1 },
  { id: 40, question: "What does compiled language mean in the context of C++?", options: ["Code runs in the browser", "Code is converted to machine code before running", "Code is interpreted line by line", "Code fixes itself automatically"], answer: 1 },
]

const cppQuestionsMarathi = [
  { id: 1, question: "C++ कोणी बनवली?", options: ["James Gosling", "Dennis Ritchie", "Bjarne Stroustrup", "Guido van Rossum"], answer: 2 },
  { id: 2, question: "C++ कोणत्या वर्षी बनवली गेली?", options: ["1972", "1979", "1991", "1995"], answer: 1 },
  { id: 3, question: "C++ मध्ये output साठी काय वापरतात?", options: ["print()", "System.out.println()", "cout", "console.log()"], answer: 2 },
  { id: 4, question: "C++ मध्ये input साठी काय वापरतात?", options: ["scanf()", "cin", "input()", "readline()"], answer: 1 },
  { id: 5, question: "C++ मध्ये iostream header कशासाठी वापरतात?", options: ["Math साठी", "Input/Output साठी", "String साठी", "Memory साठी"], answer: 1 },
  { id: 6, question: "C++ मध्ये new keyword कशासाठी वापरतात?", options: ["Variable बनवण्यासाठी", "Dynamic memory allocate करण्यासाठी", "Function बनवण्यासाठी", "Class बनवण्यासाठी"], answer: 1 },
  { id: 7, question: "C++ मध्ये memory free करण्यासाठी काय वापरतात?", options: ["free()", "remove()", "delete", "clear()"], answer: 2 },
  { id: 8, question: "C++ मध्ये pointer कशासाठी असतो?", options: ["Value store करण्यासाठी", "Memory address store करण्यासाठी", "Function call करण्यासाठी", "Array बनवण्यासाठी"], answer: 1 },
  { id: 9, question: "C++ मध्ये & operator काय देतो?", options: ["Value", "Memory address", "Size", "Type"], answer: 1 },
  { id: 10, question: "C++ मध्ये pointer सोबत * operator काय करतो?", options: ["Address देतो", "Value access करतो (dereference)", "Multiply करतो", "Delete करतो"], answer: 1 },
  { id: 11, question: "C++ मध्ये class चा default access specifier कोणता असतो?", options: ["public", "protected", "private", "static"], answer: 2 },
  { id: 12, question: "C++ मध्ये struct चा default access specifier कोणता असतो?", options: ["private", "protected", "public", "static"], answer: 2 },
  { id: 13, question: "C++ मध्ये destructor चे नाव कसे असते?", options: ["~ClassName", "delete_ClassName", "ClassName_destroy", "free_ClassName"], answer: 0 },
  { id: 14, question: "C++ मध्ये inheritance साठी कोणता syntax वापरतात?", options: ["extends", "inherits", "colon :", "->"], answer: 2 },
  { id: 15, question: "C++ मध्ये virtual function कशासाठी वापरतात?", options: ["Static binding साठी", "Runtime polymorphism साठी", "Memory save करण्यासाठी", "Speed वाढवण्यासाठी"], answer: 1 },
  { id: 16, question: "STL चे पूर्ण नाव काय आहे?", options: ["Standard Type Library", "Standard Template Library", "Static Template Library", "System Template Library"], answer: 1 },
  { id: 17, question: "C++ मध्ये vector कोणत्या प्रकारचे data structure आहे?", options: ["Fixed size array", "Dynamic array", "Linked list", "Tree"], answer: 1 },
  { id: 18, question: "C++ मध्ये vector मध्ये element add करण्यासाठी काय वापरतात?", options: ["add()", "insert()", "push_back()", "append()"], answer: 2 },
  { id: 19, question: "C++ मध्ये map कोणत्या प्रकारचा data store करतो?", options: ["Single values", "Key-value pairs", "फक्त integers", "फक्त strings"], answer: 1 },
  { id: 20, question: "C++ मध्ये template कशासाठी वापरतात?", options: ["HTML बनवण्यासाठी", "Generic programming साठी", "File read करण्यासाठी", "Memory delete करण्यासाठी"], answer: 1 },
  { id: 21, question: "C++ मध्ये ofstream कशासाठी वापरतात?", options: ["File read करण्यासाठी", "File write करण्यासाठी", "File delete करण्यासाठी", "File copy करण्यासाठी"], answer: 1 },
  { id: 22, question: "C++ मध्ये ifstream कशासाठी वापरतात?", options: ["File write करण्यासाठी", "File read करण्यासाठी", "File create करण्यासाठी", "File rename करण्यासाठी"], answer: 1 },
  { id: 23, question: "C++ मध्ये endl काय करते?", options: ["Program बंद करते", "नवीन ओळीवर जाते", "Error देते", "Input घेते"], answer: 1 },
  { id: 24, question: "C++ मध्ये do-while loop किमान किती वेळा चालतो?", options: ["0 वेळा", "1 वेळा", "2 वेळा", "5 वेळा"], answer: 1 },
  { id: 25, question: "C++ मध्ये pure virtual function कसे declare होते?", options: ["virtual void func()", "void func() = 0", "virtual void func() = 0", "abstract void func()"], answer: 2 },
  { id: 26, question: "C++ मध्ये const keyword काय करतो?", options: ["Variable delete करतो", "Variable ची value fix करतो", "Variable ला public बनवतो", "Variable ला fast बनवतो"], answer: 1 },
  { id: 27, question: "C++ मध्ये using namespace std का लिहतो?", options: ["Program fast होतो", "प्रत्येक वेळी std:: लिहण्याची गरज नाही", "Memory वाचते", "Errors कमी होतात"], answer: 1 },
  { id: 28, question: "C++ मध्ये range-based for loop कोणत्या version मध्ये आला?", options: ["C++98", "C++03", "C++11", "C++17"], answer: 2 },
  { id: 29, question: "C++ मध्ये method override करताना कोणता keyword वापरतात?", options: ["@Override", "override", "virtual", "super"], answer: 1 },
  { id: 30, question: "C++ मध्ये getline() कशासाठी वापरतात?", options: ["Integer read करण्यासाठी", "पूर्ण line read करण्यासाठी", "File open करण्यासाठी", "Output देण्यासाठी"], answer: 1 },
  { id: 31, question: "C++ मध्ये return 0 चा अर्थ काय आहे?", options: ["Program fail झाला", "Program यशस्वीरित्या संपला", "काही return होत नाही", "Program restart होतो"], answer: 1 },
  { id: 32, question: "C++ मध्ये multiple inheritance म्हणजे काय?", options: ["एकाच class मधून अनेक वेळा inherit करणे", "एक class अनेक classes मधून inherit करतो", "Class copy करणे", "Method override करणे"], answer: 1 },
  { id: 33, question: "C++ मध्ये sort() function कोणत्या header मध्ये आहे?", options: ["iostream", "string", "algorithm", "vector"], answer: 2 },
  { id: 34, question: "C++ मध्ये this pointer कशाला refer करतो?", options: ["Parent class ला", "Current object ला", "Static variable ला", "Main function ला"], answer: 1 },
  { id: 35, question: "C++ मध्ये abstract class चा object बनू शकतो का?", options: ["हो", "नाही", "कधीकधी", "Depends करतो"], answer: 1 },
  { id: 36, question: "C++ मध्ये float literal नंतर f का लिहतात?", options: ["Fast execution साठी", "Float ला double पासून वेगळे करण्यासाठी", "File साठी", "Function साठी"], answer: 1 },
  { id: 37, question: "C++ मध्ये vector ची size कशी कळते?", options: [".length()", ".count()", ".size()", ".len()"], answer: 2 },
  { id: 38, question: "C++ मध्ये auto keyword काय करतो?", options: ["Variable आपोआप delete होतो", "Compiler आपोआप type detect करतो", "Variable auto-increment होतो", "Function आपोआप call होतो"], answer: 1 },
  { id: 39, question: "C++ मध्ये pass by reference कसे होते?", options: ["Value ची copy जाते", "& ने original variable जातो", "Pointer जातो", "Array जातो"], answer: 1 },
  { id: 40, question: "C++ compiled language असणे म्हणजे काय?", options: ["Code browser मध्ये चालतो", "Code आधी machine code मध्ये convert होतो मग run होतो", "Code line by line interpret होतो", "Code स्वतः fix होतो"], answer: 1 },
]

// ─────────────────────────────────────────
// HTML MCQ — HINDI (paste after cppQuestionsMarathi)
// ─────────────────────────────────────────
const htmlQuestions = [
  { id: 1, question: "HTML का full form क्या है?", options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "HyperType Manage Language"], answer: 0 },
  { id: 2, question: "हर HTML document के सबसे ऊपर क्या लिखते हैं?", options: ["<html>", "<!DOCTYPE html>", "<head>", "<title>"], answer: 1 },
  { id: 3, question: "Page की visible content कहाँ होती है?", options: ["<head>", "<title>", "<body>", "<meta>"], answer: 2 },
  { id: 4, question: "Browser tab में नाम कौन सा tag दिखाता है?", options: ["<head>", "<h1>", "<title>", "<name>"], answer: 2 },
  { id: 5, question: "सबसे बड़ी heading के लिए कौन सा tag use होता है?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: 2 },
  { id: 6, question: "Paragraph बनाने के लिए कौन सा tag use होता है?", options: ["<para>", "<p>", "<text>", "<pg>"], answer: 1 },
  { id: 7, question: "Link बनाने के लिए कौन सा tag use होता है?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
  { id: 8, question: "Link में URL किस attribute में डालते हैं?", options: ["src", "link", "href", "url"], answer: 2 },
  { id: 9, question: "Image दिखाने के लिए कौन सा tag use होता है?", options: ["<image>", "<pic>", "<img>", "<photo>"], answer: 2 },
  { id: 10, question: "Image tag में path किस attribute में होता है?", options: ["href", "src", "link", "path"], answer: 1 },
  { id: 11, question: "Image का alt attribute किसलिए जरूरी है?", options: ["Color के लिए", "Accessibility और image न दिखने पर text के लिए", "Size के लिए", "Border के लिए"], answer: 1 },
  { id: 12, question: "Bullet points वाली list के लिए कौन सा tag use होता है?", options: ["<ol>", "<ul>", "<list>", "<dl>"], answer: 1 },
  { id: 13, question: "Numbered list के लिए कौन सा tag use होता है?", options: ["<ul>", "<list>", "<ol>", "<nl>"], answer: 2 },
  { id: 14, question: "List के हर item को किस tag में लिखते हैं?", options: ["<item>", "<li>", "<list-item>", "<el>"], answer: 1 },
  { id: 15, question: "Table row के लिए कौन सा tag use होता है?", options: ["<row>", "<tr>", "<table-row>", "<td>"], answer: 1 },
  { id: 16, question: "Table header के लिए कौन सा tag use होता है?", options: ["<header>", "<thead>", "<th>", "<td>"], answer: 2 },
  { id: 17, question: "Table data यानी cells के लिए कौन सा tag use होता है?", options: ["<data>", "<cell>", "<th>", "<td>"], answer: 3 },
  { id: 18, question: "Form बनाने के लिए कौन सा tag use होता है?", options: ["<input>", "<form>", "<data>", "<submit>"], answer: 1 },
  { id: 19, question: "Text input field के लिए कौन सा tag use होता है?", options: ["<text>", "<input>", "<field>", "<box>"], answer: 1 },
  { id: 20, question: "Multi-line text input के लिए कौन सा tag use होता है?", options: ["<input>", "<text>", "<textarea>", "<multitext>"], answer: 2 },
  { id: 21, question: "Dropdown menu के लिए कौन सा tag use होता है?", options: ["<dropdown>", "<select>", "<menu>", "<option>"], answer: 1 },
  { id: 22, question: "Page के top section यानी header के लिए कौन सा semantic tag है?", options: ["<top>", "<head>", "<header>", "<banner>"], answer: 2 },
  { id: 23, question: "Navigation links के लिए कौन सा semantic tag use होता है?", options: ["<navigation>", "<nav>", "<links>", "<menu>"], answer: 1 },
  { id: 24, question: "Page के main content के लिए कौन सा semantic tag है?", options: ["<content>", "<body>", "<main>", "<center>"], answer: 2 },
  { id: 25, question: "Page के bottom section के लिए कौन सा semantic tag है?", options: ["<bottom>", "<footer>", "<end>", "<last>"], answer: 1 },
  { id: 26, question: "Block-level container के लिए कौन सा tag use होता है?", options: ["<span>", "<div>", "<block>", "<container>"], answer: 1 },
  { id: 27, question: "Inline container के लिए कौन सा tag use होता है?", options: ["<div>", "<inline>", "<span>", "<text>"], answer: 2 },
  { id: 28, question: "Line break के लिए कौन सा tag use होता है?", options: ["<break>", "<br>", "<lb>", "<newline>"], answer: 1 },
  { id: 29, question: "Horizontal line के लिए कौन सा tag use होता है?", options: ["<line>", "<hl>", "<hr>", "<divider>"], answer: 2 },
  { id: 30, question: "Img tag self-closing क्यों है?", options: ["क्योंकि error आती है", "क्योंकि इसमें कोई content नहीं होता", "क्योंकि यह बड़ा होता है", "क्योंकि यह जरूरी नहीं है"], answer: 1 },
  { id: 31, question: "id attribute किसके लिए use होता है?", options: ["Multiple elements group करने के लिए", "एक unique element identify करने के लिए", "Color देने के लिए", "Size देने के लिए"], answer: 1 },
  { id: 32, question: "class attribute किसके लिए use होता है?", options: ["एक unique element identify करने के लिए", "Multiple elements group करने के लिए", "Page title देने के लिए", "Link बनाने के लिए"], answer: 1 },
  { id: 33, question: "Form में data कहाँ submit होगा यह कौन सा attribute बताता है?", options: ["method", "action", "submit", "destination"], answer: 1 },
  { id: 34, question: "Independent content जैसे blog post के लिए कौन सा tag है?", options: ["<section>", "<article>", "<aside>", "<post>"], answer: 1 },
  { id: 35, question: "Side content यानी sidebar के लिए कौन सा tag है?", options: ["<side>", "<sidebar>", "<aside>", "<panel>"], answer: 2 },
  { id: 36, question: "Form में submit button के लिए type attribute की value क्या होती है?", options: ["button", "send", "submit", "go"], answer: 2 },
  { id: 37, question: "Nested list क्या है?", options: ["दो अलग lists साथ-साथ", "List के अंदर list", "List को delete करना", "List को sort करना"], answer: 1 },
  { id: 38, question: "Link नए tab में खोलने के लिए कौन सा attribute use होता है?", options: ["new='tab'", "target='_blank'", "open='new'", "tab='new'"], answer: 1 },
  { id: 39, question: "Comment लिखने के लिए HTML में क्या use होता है?", options: ["// comment", "# comment", "<!-- comment -->", "/* comment */"], answer: 2 },
  { id: 40, question: "label tag किसलिए use होता है?", options: ["Image का size बताने के लिए", "Form input को describe करने के लिए", "Table बनाने के लिए", "List बनाने के लिए"], answer: 1 },
]

// ─────────────────────────────────────────
// HTML MCQ — ENGLISH
// ─────────────────────────────────────────
const htmlQuestionsEnglish = [
  { id: 1, question: "What does HTML stand for?", options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "HyperType Manage Language"], answer: 0 },
  { id: 2, question: "What is written at the very top of every HTML document?", options: ["<html>", "<!DOCTYPE html>", "<head>", "<title>"], answer: 1 },
  { id: 3, question: "Where does the visible content of a page go?", options: ["<head>", "<title>", "<body>", "<meta>"], answer: 2 },
  { id: 4, question: "Which tag controls the name shown in the browser tab?", options: ["<head>", "<h1>", "<title>", "<name>"], answer: 2 },
  { id: 5, question: "Which tag is used for the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: 2 },
  { id: 6, question: "Which tag is used to create a paragraph?", options: ["<para>", "<p>", "<text>", "<pg>"], answer: 1 },
  { id: 7, question: "Which tag is used to create a link?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
  { id: 8, question: "Which attribute holds the URL in a link?", options: ["src", "link", "href", "url"], answer: 2 },
  { id: 9, question: "Which tag is used to display an image?", options: ["<image>", "<pic>", "<img>", "<photo>"], answer: 2 },
  { id: 10, question: "Which attribute holds the path in an image tag?", options: ["href", "src", "link", "path"], answer: 1 },
  { id: 11, question: "Why is the alt attribute important on an image?", options: ["For color", "For accessibility and as fallback text if the image fails", "For size", "For border"], answer: 1 },
  { id: 12, question: "Which tag is used for a bullet-point list?", options: ["<ol>", "<ul>", "<list>", "<dl>"], answer: 1 },
  { id: 13, question: "Which tag is used for a numbered list?", options: ["<ul>", "<list>", "<ol>", "<nl>"], answer: 2 },
  { id: 14, question: "Which tag wraps each item in a list?", options: ["<item>", "<li>", "<list-item>", "<el>"], answer: 1 },
  { id: 15, question: "Which tag represents a table row?", options: ["<row>", "<tr>", "<table-row>", "<td>"], answer: 1 },
  { id: 16, question: "Which tag represents a table header?", options: ["<header>", "<thead>", "<th>", "<td>"], answer: 2 },
  { id: 17, question: "Which tag represents table data, or a cell?", options: ["<data>", "<cell>", "<th>", "<td>"], answer: 3 },
  { id: 18, question: "Which tag is used to create a form?", options: ["<input>", "<form>", "<data>", "<submit>"], answer: 1 },
  { id: 19, question: "Which tag is used for a text input field?", options: ["<text>", "<input>", "<field>", "<box>"], answer: 1 },
  { id: 20, question: "Which tag is used for a multi-line text input?", options: ["<input>", "<text>", "<textarea>", "<multitext>"], answer: 2 },
  { id: 21, question: "Which tag is used to create a dropdown menu?", options: ["<dropdown>", "<select>", "<menu>", "<option>"], answer: 1 },
  { id: 22, question: "Which semantic tag is used for the top section of a page?", options: ["<top>", "<head>", "<header>", "<banner>"], answer: 2 },
  { id: 23, question: "Which semantic tag is used for navigation links?", options: ["<navigation>", "<nav>", "<links>", "<menu>"], answer: 1 },
  { id: 24, question: "Which semantic tag represents the main content of a page?", options: ["<content>", "<body>", "<main>", "<center>"], answer: 2 },
  { id: 25, question: "Which semantic tag is used for the bottom section of a page?", options: ["<bottom>", "<footer>", "<end>", "<last>"], answer: 1 },
  { id: 26, question: "Which tag is used as a block-level container?", options: ["<span>", "<div>", "<block>", "<container>"], answer: 1 },
  { id: 27, question: "Which tag is used as an inline container?", options: ["<div>", "<inline>", "<span>", "<text>"], answer: 2 },
  { id: 28, question: "Which tag creates a line break?", options: ["<break>", "<br>", "<lb>", "<newline>"], answer: 1 },
  { id: 29, question: "Which tag creates a horizontal line?", options: ["<line>", "<hl>", "<hr>", "<divider>"], answer: 2 },
  { id: 30, question: "Why is the img tag self-closing?", options: ["Because it causes an error otherwise", "Because it has no content inside it", "Because it is too large", "Because it is optional"], answer: 1 },
  { id: 31, question: "What is the id attribute used for?", options: ["To group multiple elements", "To identify one unique element", "To set color", "To set size"], answer: 1 },
  { id: 32, question: "What is the class attribute used for?", options: ["To identify one unique element", "To group multiple elements together", "To set the page title", "To create a link"], answer: 1 },
  { id: 33, question: "Which attribute specifies where form data will be submitted?", options: ["method", "action", "submit", "destination"], answer: 1 },
  { id: 34, question: "Which tag is used for independent content like a blog post?", options: ["<section>", "<article>", "<aside>", "<post>"], answer: 1 },
  { id: 35, question: "Which tag is used for side content like a sidebar?", options: ["<side>", "<sidebar>", "<aside>", "<panel>"], answer: 2 },
  { id: 36, question: "What is the type value for a submit button in a form?", options: ["button", "send", "submit", "go"], answer: 2 },
  { id: 37, question: "What is a nested list?", options: ["Two separate lists side by side", "A list inside another list", "Deleting a list", "Sorting a list"], answer: 1 },
  { id: 38, question: "Which attribute opens a link in a new tab?", options: ["new='tab'", "target='_blank'", "open='new'", "tab='new'"], answer: 1 },
  { id: 39, question: "How do you write a comment in HTML?", options: ["// comment", "# comment", "<!-- comment -->", "/* comment */"], answer: 2 },
  { id: 40, question: "What is the label tag used for?", options: ["Describing an image's size", "Describing a form input", "Creating a table", "Creating a list"], answer: 1 },
]

// ─────────────────────────────────────────
// HTML MCQ — MARATHI
// ─────────────────────────────────────────
const htmlQuestionsMarathi = [
  { id: 1, question: "HTML चे पूर्ण नाव काय आहे?", options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "HyperType Manage Language"], answer: 0 },
  { id: 2, question: "प्रत्येक HTML document च्या सर्वात वर काय लिहतात?", options: ["<html>", "<!DOCTYPE html>", "<head>", "<title>"], answer: 1 },
  { id: 3, question: "Page चा visible content कुठे असतो?", options: ["<head>", "<title>", "<body>", "<meta>"], answer: 2 },
  { id: 4, question: "Browser tab मध्ये नाव कोणता tag दाखवतो?", options: ["<head>", "<h1>", "<title>", "<name>"], answer: 2 },
  { id: 5, question: "सर्वात मोठ्या heading साठी कोणता tag वापरतात?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: 2 },
  { id: 6, question: "Paragraph बनवण्यासाठी कोणता tag वापरतात?", options: ["<para>", "<p>", "<text>", "<pg>"], answer: 1 },
  { id: 7, question: "Link बनवण्यासाठी कोणता tag वापरतात?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
  { id: 8, question: "Link मध्ये URL कोणत्या attribute मध्ये टाकतात?", options: ["src", "link", "href", "url"], answer: 2 },
  { id: 9, question: "Image दाखवण्यासाठी कोणता tag वापरतात?", options: ["<image>", "<pic>", "<img>", "<photo>"], answer: 2 },
  { id: 10, question: "Image tag मध्ये path कोणत्या attribute मध्ये असतो?", options: ["href", "src", "link", "path"], answer: 1 },
  { id: 11, question: "Image चा alt attribute कशासाठी आवश्यक आहे?", options: ["Color साठी", "Accessibility आणि image न दिसल्यास text साठी", "Size साठी", "Border साठी"], answer: 1 },
  { id: 12, question: "Bullet points असलेल्या list साठी कोणता tag वापरतात?", options: ["<ol>", "<ul>", "<list>", "<dl>"], answer: 1 },
  { id: 13, question: "Numbered list साठी कोणता tag वापरतात?", options: ["<ul>", "<list>", "<ol>", "<nl>"], answer: 2 },
  { id: 14, question: "List च्या प्रत्येक item ला कोणत्या tag मध्ये लिहतात?", options: ["<item>", "<li>", "<list-item>", "<el>"], answer: 1 },
  { id: 15, question: "Table row साठी कोणता tag वापरतात?", options: ["<row>", "<tr>", "<table-row>", "<td>"], answer: 1 },
  { id: 16, question: "Table header साठी कोणता tag वापरतात?", options: ["<header>", "<thead>", "<th>", "<td>"], answer: 2 },
  { id: 17, question: "Table data म्हणजे cells साठी कोणता tag वापरतात?", options: ["<data>", "<cell>", "<th>", "<td>"], answer: 3 },
  { id: 18, question: "Form बनवण्यासाठी कोणता tag वापरतात?", options: ["<input>", "<form>", "<data>", "<submit>"], answer: 1 },
  { id: 19, question: "Text input field साठी कोणता tag वापरतात?", options: ["<text>", "<input>", "<field>", "<box>"], answer: 1 },
  { id: 20, question: "Multi-line text input साठी कोणता tag वापरतात?", options: ["<input>", "<text>", "<textarea>", "<multitext>"], answer: 2 },
  { id: 21, question: "Dropdown menu साठी कोणता tag वापरतात?", options: ["<dropdown>", "<select>", "<menu>", "<option>"], answer: 1 },
  { id: 22, question: "Page च्या top section साठी कोणता semantic tag आहे?", options: ["<top>", "<head>", "<header>", "<banner>"], answer: 2 },
  { id: 23, question: "Navigation links साठी कोणता semantic tag वापरतात?", options: ["<navigation>", "<nav>", "<links>", "<menu>"], answer: 1 },
  { id: 24, question: "Page च्या main content साठी कोणता semantic tag आहे?", options: ["<content>", "<body>", "<main>", "<center>"], answer: 2 },
  { id: 25, question: "Page च्या bottom section साठी कोणता semantic tag आहे?", options: ["<bottom>", "<footer>", "<end>", "<last>"], answer: 1 },
  { id: 26, question: "Block-level container साठी कोणता tag वापरतात?", options: ["<span>", "<div>", "<block>", "<container>"], answer: 1 },
  { id: 27, question: "Inline container साठी कोणता tag वापरतात?", options: ["<div>", "<inline>", "<span>", "<text>"], answer: 2 },
  { id: 28, question: "Line break साठी कोणता tag वापरतात?", options: ["<break>", "<br>", "<lb>", "<newline>"], answer: 1 },
  { id: 29, question: "Horizontal line साठी कोणता tag वापरतात?", options: ["<line>", "<hl>", "<hr>", "<divider>"], answer: 2 },
  { id: 30, question: "Img tag self-closing का असतो?", options: ["कारण error येते", "कारण त्यात कोणताही content नसतो", "कारण तो मोठा असतो", "कारण तो आवश्यक नाही"], answer: 1 },
  { id: 31, question: "id attribute कशासाठी वापरतात?", options: ["Multiple elements group करण्यासाठी", "एक unique element identify करण्यासाठी", "Color देण्यासाठी", "Size देण्यासाठी"], answer: 1 },
  { id: 32, question: "class attribute कशासाठी वापरतात?", options: ["एक unique element identify करण्यासाठी", "Multiple elements group करण्यासाठी", "Page title देण्यासाठी", "Link बनवण्यासाठी"], answer: 1 },
  { id: 33, question: "Form मध्ये data कुठे submit होईल हे कोणता attribute सांगतो?", options: ["method", "action", "submit", "destination"], answer: 1 },
  { id: 34, question: "Independent content जसे blog post साठी कोणता tag आहे?", options: ["<section>", "<article>", "<aside>", "<post>"], answer: 1 },
  { id: 35, question: "Side content म्हणजे sidebar साठी कोणता tag आहे?", options: ["<side>", "<sidebar>", "<aside>", "<panel>"], answer: 2 },
  { id: 36, question: "Form मध्ये submit button साठी type attribute ची value काय असते?", options: ["button", "send", "submit", "go"], answer: 2 },
  { id: 37, question: "Nested list म्हणजे काय?", options: ["दोन वेगळ्या lists एकत्र", "List च्या आत list", "List delete करणे", "List sort करणे"], answer: 1 },
  { id: 38, question: "Link नवीन tab मध्ये उघडण्यासाठी कोणता attribute वापरतात?", options: ["new='tab'", "target='_blank'", "open='new'", "tab='new'"], answer: 1 },
  { id: 39, question: "HTML मध्ये comment लिहण्यासाठी काय वापरतात?", options: ["// comment", "# comment", "<!-- comment -->", "/* comment */"], answer: 2 },
  { id: 40, question: "label tag कशासाठी वापरतात?", options: ["Image चा size सांगण्यासाठी", "Form input describe करण्यासाठी", "Table बनवण्यासाठी", "List बनवण्यासाठी"], answer: 1 },
]

// ─────────────────────────────────────────
// CSS MCQ — HINDI (paste after htmlQuestionsMarathi)
// ─────────────────────────────────────────
const cssQuestions = [
  { id: 1, question: "CSS का full form क्या है?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"], answer: 0 },
  { id: 2, question: "External CSS file को HTML से जोड़ने के लिए कौन सा tag use होता है?", options: ["<style>", "<css>", "<link>", "<script>"], answer: 2 },
  { id: 3, question: "Internal CSS किस tag के अंदर लिखते हैं?", options: ["<css>", "<style>", "<link>", "<head-style>"], answer: 1 },
  { id: 4, question: "Class selector किस symbol से शुरू होता है?", options: ["#", ".", "*", "&"], answer: 1 },
  { id: 5, question: "ID selector किस symbol से शुरू होता है?", options: [".", "#", "@", "%"], answer: 1 },
  { id: 6, question: "Universal selector कौन सा symbol है?", options: ["#", ".", "*", "$"], answer: 2 },
  { id: 7, question: "Text का रंग set करने के लिए कौन सी property use होती है?", options: ["text-color", "font-color", "color", "fg-color"], answer: 2 },
  { id: 8, question: "Background का रंग set करने के लिए कौन सी property use होती है?", options: ["background-color", "bg-color", "color-bg", "back-color"], answer: 0 },
  { id: 9, question: "Hex code में #ff0000 किस रंग को दिखाता है?", options: ["हरा", "नीला", "लाल", "पीला"], answer: 2 },
  { id: 10, question: "Box model में content के सबसे करीब कौन सा layer होता है?", options: ["Margin", "Border", "Padding", "Outline"], answer: 2 },
  { id: 11, question: "Box model में margin कहाँ होता है?", options: ["Content के सबसे अंदर", "Padding और border के बीच", "Border के सबसे बाहर", "Border के अंदर"], answer: 2 },
  { id: 12, question: "Corners को round करने के लिए कौन सी property use होती है?", options: ["corner-radius", "round-corner", "border-radius", "box-radius"], answer: 2 },
  { id: 13, question: "Font का size set करने के लिए कौन सी property use होती है?", options: ["text-size", "font-size", "size", "font-weight"], answer: 1 },
  { id: 14, question: "Text को bold बनाने के लिए कौन सी property use होती है?", options: ["font-bold", "text-weight", "font-weight", "bold"], answer: 2 },
  { id: 15, question: "Text को center करने के लिए कौन सी property use होती है?", options: ["align", "text-center", "text-align", "center"], answer: 2 },
  { id: 16, question: "Underline हटाने के लिए text-decoration की value क्या होगी?", options: ["remove", "no-underline", "none", "off"], answer: 2 },
  { id: 17, question: "Element को flex container बनाने के लिए क्या लिखते हैं?", options: ["display: flexbox", "display: flex", "position: flex", "type: flex"], answer: 1 },
  { id: 18, question: "Flexbox में horizontal alignment किस property से होती है?", options: ["align-items", "justify-content", "flex-direction", "text-align"], answer: 1 },
  { id: 19, question: "Flexbox में vertical alignment किस property से होती है?", options: ["justify-content", "align-items", "flex-wrap", "direction"], answer: 1 },
  { id: 20, question: "Flex items के बीच spacing देने के लिए कौन सी property use होती है?", options: ["space", "margin-all", "gap", "spacing"], answer: 2 },
  { id: 21, question: "Element को grid container बनाने के लिए क्या लिखते हैं?", options: ["display: grid", "display: gridbox", "position: grid", "layout: grid"], answer: 0 },
  { id: 22, question: "Grid में fr unit किसके लिए होता है?", options: ["Fixed pixel", "Fraction of available space", "Font ratio", "Frame"], answer: 1 },
  { id: 23, question: "Media query किसलिए use होती है?", options: ["Colors बदलने के लिए", "Screen size के हिसाब से style बदलने के लिए", "Font बदलने के लिए", "Animation बनाने के लिए"], answer: 1 },
  { id: 24, question: "@media (max-width: 768px) का क्या मतलब है?", options: ["Screen हमेशा 768px होगी", "Style तभी apply होगी जब screen 768px या उससे कम हो", "Screen कभी 768px नहीं होगी", "768px के बाद style हट जाएगी"], answer: 1 },
  { id: 25, question: "Mobile-first approach में पहले क्या लिखते हैं?", options: ["Desktop styles", "Mobile styles", "Tablet styles", "Print styles"], answer: 1 },
  { id: 26, question: "hover pseudo-class कब trigger होती है?", options: ["Page load होने पर", "Mouse element पर आने पर", "Click करने पर", "Scroll करने पर"], answer: 1 },
  { id: 27, question: "transition property किसलिए use होती है?", options: ["Element को delete करने के लिए", "Properties को smoothly बदलने के लिए", "Element को hide करने के लिए", "Page reload करने के लिए"], answer: 1 },
  { id: 28, question: "transform property से क्या कर सकते हैं?", options: ["सिर्फ color बदल सकते हैं", "Move, rotate, scale कर सकते हैं", "सिर्फ size बदल सकते हैं", "सिर्फ font बदल सकते हैं"], answer: 1 },
  { id: 29, question: "box-sizing: border-box का क्या फायदा है?", options: ["Element तेज़ load होता है", "Padding और border total width में count होते हैं", "Colors बेहतर दिखते हैं", "Fonts छोटे होते हैं"], answer: 1 },
  { id: 30, question: "rgba में 'a' किसके लिए होता है?", options: ["Angle", "Alpha (opacity)", "Area", "Average"], answer: 1 },
  { id: 31, question: "line-height किसको control करती है?", options: ["Letters के बीच की spacing", "Lines के बीच की spacing", "Words के बीच की spacing", "Paragraphs की width"], answer: 1 },
  { id: 32, question: "letter-spacing किसको control करती है?", options: ["Lines के बीच की spacing", "Letters के बीच की spacing", "Page की margin", "Image का size"], answer: 1 },
  { id: 33, question: "CSS में cascading का मतलब क्या है?", options: ["सभी styles अलग रहती हैं", "Multiple rules में से कौन सा जीतेगा यह rules से तय होता है", "Styles delete होती रहती हैं", "Colors automatically बदलते हैं"], answer: 1 },
  { id: 34, question: "Inline CSS कहाँ लिखी जाती है?", options: ["अलग .css file में", "<style> tag में", "Element के style attribute में", "<head> में अलग से"], answer: 2 },
  { id: 35, question: "grid-template-columns: repeat(3, 1fr) का क्या मतलब है?", options: ["3 बराबर columns", "3 rows", "3 fixed-width columns", "3 different sized columns"], answer: 0 },
  { id: 36, question: "viewport meta tag किसलिए जरूरी है?", options: ["SEO के लिए", "Responsive design के लिए", "Speed के लिए", "Security के लिए"], answer: 1 },
  { id: 37, question: "Descendant selector कैसे लिखते हैं?", options: ["div > p", "div.p", "div p (space से)", "div+p"], answer: 2 },
  { id: 38, question: "Group selector में अलग-अलग selectors को कैसे अलग करते हैं?", options: ["Space से", "Comma से", "Plus से", "Colon से"], answer: 1 },
  { id: 39, question: "flex-wrap किसलिए use होता है?", options: ["Items को rotate करने के लिए", "Items को नई line में wrap करने के लिए", "Items को delete करने के लिए", "Items को hide करने के लिए"], answer: 1 },
  { id: 40, question: "External CSS best practice क्यों है?", options: ["सबसे fast load होता है", "Code organized रहता है और कई pages share कर सकते हैं", "Colors बेहतर दिखते हैं", "Errors नहीं आती"], answer: 1 },
]

// ─────────────────────────────────────────
// CSS MCQ — ENGLISH
// ─────────────────────────────────────────
const cssQuestionsEnglish = [
  { id: 1, question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"], answer: 0 },
  { id: 2, question: "Which tag links an external CSS file to HTML?", options: ["<style>", "<css>", "<link>", "<script>"], answer: 2 },
  { id: 3, question: "Inside which tag is internal CSS written?", options: ["<css>", "<style>", "<link>", "<head-style>"], answer: 1 },
  { id: 4, question: "Which symbol does a class selector start with?", options: ["#", ".", "*", "&"], answer: 1 },
  { id: 5, question: "Which symbol does an ID selector start with?", options: [".", "#", "@", "%"], answer: 1 },
  { id: 6, question: "Which symbol is the universal selector?", options: ["#", ".", "*", "$"], answer: 2 },
  { id: 7, question: "Which property sets the color of text?", options: ["text-color", "font-color", "color", "fg-color"], answer: 2 },
  { id: 8, question: "Which property sets the background color?", options: ["background-color", "bg-color", "color-bg", "back-color"], answer: 0 },
  { id: 9, question: "What color does the hex code #ff0000 represent?", options: ["Green", "Blue", "Red", "Yellow"], answer: 2 },
  { id: 10, question: "In the box model, which layer is closest to the content?", options: ["Margin", "Border", "Padding", "Outline"], answer: 2 },
  { id: 11, question: "In the box model, where is margin located?", options: ["Innermost, around the content", "Between padding and border", "Outermost, outside the border", "Inside the border"], answer: 2 },
  { id: 12, question: "Which property rounds the corners of an element?", options: ["corner-radius", "round-corner", "border-radius", "box-radius"], answer: 2 },
  { id: 13, question: "Which property sets the size of a font?", options: ["text-size", "font-size", "size", "font-weight"], answer: 1 },
  { id: 14, question: "Which property makes text bold?", options: ["font-bold", "text-weight", "font-weight", "bold"], answer: 2 },
  { id: 15, question: "Which property centers text?", options: ["align", "text-center", "text-align", "center"], answer: 2 },
  { id: 16, question: "Which value of text-decoration removes underline?", options: ["remove", "no-underline", "none", "off"], answer: 2 },
  { id: 17, question: "What turns an element into a flex container?", options: ["display: flexbox", "display: flex", "position: flex", "type: flex"], answer: 1 },
  { id: 18, question: "Which Flexbox property handles horizontal alignment?", options: ["align-items", "justify-content", "flex-direction", "text-align"], answer: 1 },
  { id: 19, question: "Which Flexbox property handles vertical alignment?", options: ["justify-content", "align-items", "flex-wrap", "direction"], answer: 1 },
  { id: 20, question: "Which property adds spacing between flex items?", options: ["space", "margin-all", "gap", "spacing"], answer: 2 },
  { id: 21, question: "What turns an element into a grid container?", options: ["display: grid", "display: gridbox", "position: grid", "layout: grid"], answer: 0 },
  { id: 22, question: "What is the fr unit used for in CSS Grid?", options: ["Fixed pixel", "Fraction of available space", "Font ratio", "Frame"], answer: 1 },
  { id: 23, question: "What are media queries used for?", options: ["Changing colors", "Applying different styles based on screen size", "Changing fonts", "Creating animations"], answer: 1 },
  { id: 24, question: "What does @media (max-width: 768px) mean?", options: ["The screen will always be 768px", "These styles apply only when the screen is 768px or smaller", "The screen will never be 768px", "Styles are removed after 768px"], answer: 1 },
  { id: 25, question: "In a mobile-first approach, what do you write first?", options: ["Desktop styles", "Mobile styles", "Tablet styles", "Print styles"], answer: 1 },
  { id: 26, question: "When does the hover pseudo-class trigger?", options: ["When the page loads", "When the mouse moves over an element", "When you click", "When you scroll"], answer: 1 },
  { id: 27, question: "What is the transition property used for?", options: ["Deleting an element", "Smoothly animating property changes", "Hiding an element", "Reloading the page"], answer: 1 },
  { id: 28, question: "What can the transform property do?", options: ["Only change color", "Move, rotate, and scale elements", "Only change size", "Only change font"], answer: 1 },
  { id: 29, question: "What is the benefit of box-sizing: border-box?", options: ["Elements load faster", "Padding and border are included in the total width", "Colors look better", "Fonts become smaller"], answer: 1 },
  { id: 30, question: "What does the 'a' in rgba stand for?", options: ["Angle", "Alpha (opacity)", "Area", "Average"], answer: 1 },
  { id: 31, question: "What does line-height control?", options: ["Spacing between letters", "Spacing between lines", "Spacing between words", "Width of paragraphs"], answer: 1 },
  { id: 32, question: "What does letter-spacing control?", options: ["Spacing between lines", "Spacing between letters", "Page margin", "Image size"], answer: 1 },
  { id: 33, question: "What does cascading mean in CSS?", options: ["All styles stay independent", "Specific rules decide which of multiple matching rules wins", "Styles keep getting deleted", "Colors change automatically"], answer: 1 },
  { id: 34, question: "Where is inline CSS written?", options: ["In a separate .css file", "Inside a style tag", "In the style attribute of an element", "Separately in the head"], answer: 2 },
  { id: 35, question: "What does grid-template-columns: repeat(3, 1fr) mean?", options: ["3 equal columns", "3 rows", "3 fixed-width columns", "3 different sized columns"], answer: 0 },
  { id: 36, question: "Why is the viewport meta tag important?", options: ["For SEO", "For responsive design", "For speed", "For security"], answer: 1 },
  { id: 37, question: "How do you write a descendant selector?", options: ["div > p", "div.p", "div p (with a space)", "div+p"], answer: 2 },
  { id: 38, question: "How are individual selectors separated in a group selector?", options: ["With a space", "With a comma", "With a plus sign", "With a colon"], answer: 1 },
  { id: 39, question: "What is flex-wrap used for?", options: ["Rotating items", "Wrapping items onto a new line", "Deleting items", "Hiding items"], answer: 1 },
  { id: 40, question: "Why is external CSS considered best practice?", options: ["It always loads the fastest", "Code stays organized and can be shared across pages", "Colors look better", "It prevents errors"], answer: 1 },
]

// ─────────────────────────────────────────
// CSS MCQ — MARATHI
// ─────────────────────────────────────────
const cssQuestionsMarathi = [
  { id: 1, question: "CSS चे पूर्ण नाव काय आहे?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"], answer: 0 },
  { id: 2, question: "External CSS file ला HTML शी जोडण्यासाठी कोणता tag वापरतात?", options: ["<style>", "<css>", "<link>", "<script>"], answer: 2 },
  { id: 3, question: "Internal CSS कोणत्या tag च्या आत लिहतात?", options: ["<css>", "<style>", "<link>", "<head-style>"], answer: 1 },
  { id: 4, question: "Class selector कोणत्या symbol ने सुरू होतो?", options: ["#", ".", "*", "&"], answer: 1 },
  { id: 5, question: "ID selector कोणत्या symbol ने सुरू होतो?", options: [".", "#", "@", "%"], answer: 1 },
  { id: 6, question: "Universal selector कोणता symbol आहे?", options: ["#", ".", "*", "$"], answer: 2 },
  { id: 7, question: "Text चा रंग set करण्यासाठी कोणती property वापरतात?", options: ["text-color", "font-color", "color", "fg-color"], answer: 2 },
  { id: 8, question: "Background चा रंग set करण्यासाठी कोणती property वापरतात?", options: ["background-color", "bg-color", "color-bg", "back-color"], answer: 0 },
  { id: 9, question: "Hex code #ff0000 कोणता रंग दाखवतो?", options: ["हिरवा", "निळा", "लाल", "पिवळा"], answer: 2 },
  { id: 10, question: "Box model मध्ये content च्या सर्वात जवळ कोणता layer असतो?", options: ["Margin", "Border", "Padding", "Outline"], answer: 2 },
  { id: 11, question: "Box model मध्ये margin कुठे असतो?", options: ["Content च्या सर्वात आत", "Padding आणि border च्या मध्ये", "Border च्या सर्वात बाहेर", "Border च्या आत"], answer: 2 },
  { id: 12, question: "Corners round करण्यासाठी कोणती property वापरतात?", options: ["corner-radius", "round-corner", "border-radius", "box-radius"], answer: 2 },
  { id: 13, question: "Font चा size set करण्यासाठी कोणती property वापरतात?", options: ["text-size", "font-size", "size", "font-weight"], answer: 1 },
  { id: 14, question: "Text bold करण्यासाठी कोणती property वापरतात?", options: ["font-bold", "text-weight", "font-weight", "bold"], answer: 2 },
  { id: 15, question: "Text center करण्यासाठी कोणती property वापरतात?", options: ["align", "text-center", "text-align", "center"], answer: 2 },
  { id: 16, question: "Underline हटवण्यासाठी text-decoration ची value काय असेल?", options: ["remove", "no-underline", "none", "off"], answer: 2 },
  { id: 17, question: "Element ला flex container बनवण्यासाठी काय लिहतात?", options: ["display: flexbox", "display: flex", "position: flex", "type: flex"], answer: 1 },
  { id: 18, question: "Flexbox मध्ये horizontal alignment कोणत्या property ने होते?", options: ["align-items", "justify-content", "flex-direction", "text-align"], answer: 1 },
  { id: 19, question: "Flexbox मध्ये vertical alignment कोणत्या property ने होते?", options: ["justify-content", "align-items", "flex-wrap", "direction"], answer: 1 },
  { id: 20, question: "Flex items च्या मध्ये spacing देण्यासाठी कोणती property वापरतात?", options: ["space", "margin-all", "gap", "spacing"], answer: 2 },
  { id: 21, question: "Element ला grid container बनवण्यासाठी काय लिहतात?", options: ["display: grid", "display: gridbox", "position: grid", "layout: grid"], answer: 0 },
  { id: 22, question: "Grid मध्ये fr unit कशासाठी आहे?", options: ["Fixed pixel", "Available space चा fraction", "Font ratio", "Frame"], answer: 1 },
  { id: 23, question: "Media query कशासाठी वापरतात?", options: ["Colors बदलण्यासाठी", "Screen size नुसार style बदलण्यासाठी", "Font बदलण्यासाठी", "Animation बनवण्यासाठी"], answer: 1 },
  { id: 24, question: "@media (max-width: 768px) चा अर्थ काय आहे?", options: ["Screen नेहमी 768px असेल", "Style तेव्हाच apply होईल जेव्हा screen 768px किंवा त्यापेक्षा कमी असेल", "Screen कधीही 768px नसेल", "768px नंतर style हटते"], answer: 1 },
  { id: 25, question: "Mobile-first approach मध्ये आधी काय लिहतात?", options: ["Desktop styles", "Mobile styles", "Tablet styles", "Print styles"], answer: 1 },
  { id: 26, question: "hover pseudo-class कधी trigger होतो?", options: ["Page load झाल्यावर", "Mouse element वर आल्यावर", "Click केल्यावर", "Scroll केल्यावर"], answer: 1 },
  { id: 27, question: "transition property कशासाठी वापरतात?", options: ["Element delete करण्यासाठी", "Properties smoothly बदलण्यासाठी", "Element hide करण्यासाठी", "Page reload करण्यासाठी"], answer: 1 },
  { id: 28, question: "transform property ने काय करता येते?", options: ["फक्त color बदलता येतो", "Move, rotate, scale करता येते", "फक्त size बदलता येतो", "फक्त font बदलता येतो"], answer: 1 },
  { id: 29, question: "box-sizing: border-box चा फायदा काय आहे?", options: ["Element लवकर load होतो", "Padding आणि border total width मध्ये count होतात", "Colors चांगले दिसतात", "Fonts लहान होतात"], answer: 1 },
  { id: 30, question: "rgba मधील 'a' कशासाठी आहे?", options: ["Angle", "Alpha (opacity)", "Area", "Average"], answer: 1 },
  { id: 31, question: "line-height काय control करते?", options: ["Letters च्या मधील spacing", "Lines च्या मधील spacing", "Words च्या मधील spacing", "Paragraphs ची width"], answer: 1 },
  { id: 32, question: "letter-spacing काय control करते?", options: ["Lines च्या मधील spacing", "Letters च्या मधील spacing", "Page चा margin", "Image चा size"], answer: 1 },
  { id: 33, question: "CSS मध्ये cascading चा अर्थ काय आहे?", options: ["सर्व styles वेगळ्या राहतात", "Multiple rules मधून कोणता जिंकेल हे rules ने ठरते", "Styles delete होत राहतात", "Colors आपोआप बदलतात"], answer: 1 },
  { id: 34, question: "Inline CSS कुठे लिहतात?", options: ["वेगळ्या .css file मध्ये", "style tag मध्ये", "Element च्या style attribute मध्ये", "head मध्ये वेगळे"], answer: 2 },
  { id: 35, question: "grid-template-columns: repeat(3, 1fr) चा अर्थ काय आहे?", options: ["3 equal columns", "3 rows", "3 fixed-width columns", "3 वेगवेगळ्या size चे columns"], answer: 0 },
  { id: 36, question: "viewport meta tag कशासाठी आवश्यक आहे?", options: ["SEO साठी", "Responsive design साठी", "Speed साठी", "Security साठी"], answer: 1 },
  { id: 37, question: "Descendant selector कसे लिहतात?", options: ["div > p", "div.p", "div p (space ने)", "div+p"], answer: 2 },
  { id: 38, question: "Group selector मध्ये वेगवेगळे selectors कसे वेगळे करतात?", options: ["Space ने", "Comma ने", "Plus ने", "Colon ने"], answer: 1 },
  { id: 39, question: "flex-wrap कशासाठी वापरतात?", options: ["Items rotate करण्यासाठी", "Items नवीन line मध्ये wrap करण्यासाठी", "Items delete करण्यासाठी", "Items hide करण्यासाठी"], answer: 1 },
  { id: 40, question: "External CSS best practice का आहे?", options: ["सर्वात fast load होतो", "Code organized राहतो आणि अनेक pages share करता येतात", "Colors चांगले दिसतात", "Errors येत नाहीत"], answer: 1 },
]

// ─────────────────────────────────────────
// TAILWIND CSS MCQ — HINDI (paste after cssQuestionsMarathi)
// ─────────────────────────────────────────
const tailwindQuestions = [
  { id: 1, question: "Tailwind CSS किस प्रकार का framework है?", options: ["Component-based", "Utility-first", "Object-oriented", "Template-based"], answer: 1 },
  { id: 2, question: "Tailwind को किसने बनाया?", options: ["Dan Abramov", "Adam Wathan", "Evan You", "Brendan Eich"], answer: 1 },
  { id: 3, question: "Quick testing के लिए Tailwind add करने का सबसे आसान तरीका क्या है?", options: ["npm install", "CDN link", "Download ZIP", "Git clone"], answer: 1 },
  { id: 4, question: "p-4 class से कितनी padding मिलती है?", options: ["4px", "16px", "8px", "40px"], answer: 1 },
  { id: 5, question: "px class किसके लिए होता है?", options: ["सिर्फ top padding", "Left और right दोनों padding", "सिर्फ bottom padding", "सिर्फ left padding"], answer: 1 },
  { id: 6, question: "Tailwind में हर color के कितने shades होते हैं?", options: ["5", "10", "15", "20"], answer: 1 },
  { id: 7, question: "bg-blue-500 क्या करता है?", options: ["Text का रंग blue करता है", "Background का रंग medium blue करता है", "Border का रंग blue करता है", "Font को blue बनाता है"], answer: 1 },
  { id: 8, question: "Element को flex container बनाने के लिए कौन सी class use होती है?", options: ["display-flex", "flex", "flexbox", "row"], answer: 1 },
  { id: 9, question: "justify-center किसके लिए use होता है?", options: ["Vertical alignment", "Horizontal alignment", "Text size", "Font weight"], answer: 1 },
  { id: 10, question: "items-center किसके लिए use होता है?", options: ["Horizontal alignment", "Vertical alignment", "Background color", "Border radius"], answer: 1 },
  { id: 11, question: "Element को grid container बनाने के लिए कौन सी class use होती है?", options: ["display-grid", "grid", "gridbox", "table"], answer: 1 },
  { id: 12, question: "grid-cols-3 का क्या मतलब है?", options: ["3 rows", "3 equal columns", "3px width", "3 items"], answer: 1 },
  { id: 13, question: "col-span-2 क्या करता है?", options: ["2 rows बनाता है", "Item को 2 columns में फैलाता है", "2 items hide करता है", "2px margin देता है"], answer: 1 },
  { id: 14, question: "md: prefix किस screen size के लिए apply होता है?", options: ["480px और छोटी", "768px और बड़ी", "1920px और बड़ी", "सभी screens"], answer: 1 },
  { id: 15, question: "Tailwind mobile-first है इसका मतलब क्या है?", options: ["सिर्फ mobile पर काम करता है", "Default styles mobile के लिए होती हैं फिर larger screens के लिए prefix लगाते हैं", "Desktop के लिए कोई support नहीं", "Tablet सबसे पहले आता है"], answer: 1 },
  { id: 16, question: "hover: prefix कब trigger होता है?", options: ["Page load पर", "Mouse element पर आने पर", "Click करने पर", "Scroll करने पर"], answer: 1 },
  { id: 17, question: "focus: prefix किस element types पर सबसे ज्यादा use होता है?", options: ["Images", "Buttons", "Input fields", "Headings"], answer: 2 },
  { id: 18, question: "text-center क्या करता है?", options: ["Text को bold करता है", "Text को center align करता है", "Text का size बढ़ाता है", "Text को underline करता है"], answer: 1 },
  { id: 19, question: "font-bold क्या करता है?", options: ["Text का size बढ़ाता है", "Text को bold बनाता है", "Text को italic बनाता है", "Text को center करता है"], answer: 1 },
  { id: 20, question: "rounded-xl क्या करता है?", options: ["Border का रंग बदलता है", "Corners को बहुत round बनाता है", "Element को hide करता है", "Width बदलता है"], answer: 1 },
  { id: 21, question: "shadow-md क्या करता है?", options: ["Background color बदलता है", "Medium box shadow देता है", "Text shadow देता है", "Border हटाता है"], answer: 1 },
  { id: 22, question: "transition-colors किसके लिए use होता है?", options: ["Color changes को smooth animate करने के लिए", "Layout बदलने के लिए", "Page reload करने के लिए", "Image resize करने के लिए"], answer: 0 },
  { id: 23, question: "group-hover: कैसे काम करता है?", options: ["Sirf parent पर apply होता है", "Parent hover होने पर child elements की style बदलती है", "Sभी elements hover करते हैं", "कुछ नहीं करता"], answer: 1 },
  { id: 24, question: "gap-4 किसके लिए use होता है?", options: ["Margin के लिए", "Flex या grid items के बीच spacing के लिए", "Font size के लिए", "Border width के लिए"], answer: 1 },
  { id: 25, question: "hidden class क्या करती है?", options: ["Element को छोटा बनाती है", "Element को display: none करती है", "Element का रंग हल्का करती है", "Element को move करती है"], answer: 1 },
  { id: 26, question: "max-w-sm क्या करता है?", options: ["Maximum height set करता है", "Maximum width small set करता है", "Margin set करता है", "Font size set करता है"], answer: 1 },
  { id: 27, question: "mx-auto किसके लिए use होता है?", options: ["Element को vertically center करने के लिए", "Element को horizontally center करने के लिए (auto margins)", "Padding बढ़ाने के लिए", "Border देने के लिए"], answer: 1 },
  { id: 28, question: "w-full किसके लिए है?", options: ["Width 100% करने के लिए", "Height 100% करने के लिए", "Full screen बनाने के लिए", "Full opacity के लिए"], answer: 0 },
  { id: 29, question: "object-cover किस element पर use होता है?", options: ["Buttons पर", "Images पर", "Headings पर", "Forms पर"], answer: 1 },
  { id: 30, question: "duration-300 का क्या मतलब है?", options: ["300px width", "300 milliseconds की transition speed", "300 items", "300% opacity"], answer: 1 },
  { id: 31, question: "Tailwind में responsive design के लिए कौन सा order सही है?", options: ["xl, lg, md, sm", "sm, md, lg, xl", "md, sm, xl, lg", "lg, xl, sm, md"], answer: 1 },
  { id: 32, question: "bg-blue-500/50 में /50 क्या दिखाता है?", options: ["50px size", "50% opacity", "50 items", "50 shade number"], answer: 1 },
  { id: 33, question: "flex-col क्या करता है?", options: ["Items को row में लगाता है", "Items को column में लगाता है", "Items को hide करता है", "Items को center करता है"], answer: 1 },
  { id: 34, question: "tailwind.config.js file किसलिए है?", options: ["सिर्फ documentation के लिए", "Tailwind को customize करने के लिए", "Images store करने के लिए", "Database connect करने के लिए"], answer: 1 },
  { id: 35, question: "@tailwind base, components, utilities directives कहाँ लिखते हैं?", options: ["HTML file में", "Main CSS file में", "JavaScript file में", "Config file में"], answer: 1 },
  { id: 36, question: "truncate class क्या करती है?", options: ["Text को बड़ा करती है", "लंबे text को एक line में ... के साथ cut करती है", "Text को delete करती है", "Text को बदलती है"], answer: 1 },
  { id: 37, question: "Tailwind में disabled: prefix किसलिए है?", options: ["Disabled elements के लिए अलग styling", "Page को disable करने के लिए", "JavaScript disable करने के लिए", "Forms हटाने के लिए"], answer: 0 },
  { id: 38, question: "leading-relaxed क्या control करता है?", options: ["Font weight", "Line height", "Letter spacing", "Text color"], answer: 1 },
  { id: 39, question: "Tailwind में dark: prefix किसके लिए है?", options: ["Dark colors देने के लिए हमेशा", "Dark mode के लिए अलग styles देने के लिए", "Text को बोल्ड बनाने के लिए", "Border को गहरा बनाने के लिए"], answer: 1 },
  { id: 40, question: "Production में Tailwind file size छोटी क्यों रहती है?", options: ["सभी classes automatically compress होती हैं", "सिर्फ actually used classes ही final CSS में include होती हैं", "Images compress होती हैं", "JavaScript कम होती है"], answer: 1 },
]

// ─────────────────────────────────────────
// TAILWIND CSS MCQ — ENGLISH
// ─────────────────────────────────────────
const tailwindQuestionsEnglish = [
  { id: 1, question: "What type of framework is Tailwind CSS?", options: ["Component-based", "Utility-first", "Object-oriented", "Template-based"], answer: 1 },
  { id: 2, question: "Who created Tailwind?", options: ["Dan Abramov", "Adam Wathan", "Evan You", "Brendan Eich"], answer: 1 },
  { id: 3, question: "What is the easiest way to add Tailwind for quick testing?", options: ["npm install", "CDN link", "Download ZIP", "Git clone"], answer: 1 },
  { id: 4, question: "How much padding does p-4 give?", options: ["4px", "16px", "8px", "40px"], answer: 1 },
  { id: 5, question: "What does the px class apply padding to?", options: ["Only top", "Both left and right", "Only bottom", "Only left"], answer: 1 },
  { id: 6, question: "How many shades does each color have in Tailwind?", options: ["5", "10", "15", "20"], answer: 1 },
  { id: 7, question: "What does bg-blue-500 do?", options: ["Makes text color blue", "Makes the background a medium blue", "Makes the border blue", "Makes the font blue"], answer: 1 },
  { id: 8, question: "Which class makes an element a flex container?", options: ["display-flex", "flex", "flexbox", "row"], answer: 1 },
  { id: 9, question: "What is justify-center used for?", options: ["Vertical alignment", "Horizontal alignment", "Text size", "Font weight"], answer: 1 },
  { id: 10, question: "What is items-center used for?", options: ["Horizontal alignment", "Vertical alignment", "Background color", "Border radius"], answer: 1 },
  { id: 11, question: "Which class makes an element a grid container?", options: ["display-grid", "grid", "gridbox", "table"], answer: 1 },
  { id: 12, question: "What does grid-cols-3 mean?", options: ["3 rows", "3 equal columns", "3px width", "3 items"], answer: 1 },
  { id: 13, question: "What does col-span-2 do?", options: ["Creates 2 rows", "Makes an item span across 2 columns", "Hides 2 items", "Adds 2px margin"], answer: 1 },
  { id: 14, question: "At which screen size does the md: prefix apply?", options: ["480px and smaller", "768px and above", "1920px and above", "All screens"], answer: 1 },
  { id: 15, question: "What does mobile-first mean in Tailwind?", options: ["It only works on mobile", "Default styles are for mobile, prefixes are used for larger screens", "There is no support for desktop", "Tablet comes first"], answer: 1 },
  { id: 16, question: "When does the hover: prefix trigger?", options: ["On page load", "When the mouse moves over the element", "When clicked", "When scrolled"], answer: 1 },
  { id: 17, question: "Which element type most commonly uses focus:?", options: ["Images", "Buttons", "Input fields", "Headings"], answer: 2 },
  { id: 18, question: "What does text-center do?", options: ["Makes text bold", "Centers text alignment", "Increases text size", "Underlines text"], answer: 1 },
  { id: 19, question: "What does font-bold do?", options: ["Increases text size", "Makes text bold", "Makes text italic", "Centers text"], answer: 1 },
  { id: 20, question: "What does rounded-xl do?", options: ["Changes border color", "Makes corners very rounded", "Hides the element", "Changes width"], answer: 1 },
  { id: 21, question: "What does shadow-md do?", options: ["Changes background color", "Gives a medium box shadow", "Gives a text shadow", "Removes border"], answer: 1 },
  { id: 22, question: "What is transition-colors used for?", options: ["Smoothly animating color changes", "Changing layout", "Reloading the page", "Resizing images"], answer: 0 },
  { id: 23, question: "How does group-hover: work?", options: ["Only applies to the parent", "Changes child element styles when the parent is hovered", "All elements hover at once", "It does nothing"], answer: 1 },
  { id: 24, question: "What is gap-4 used for?", options: ["Margin", "Spacing between flex or grid items", "Font size", "Border width"], answer: 1 },
  { id: 25, question: "What does the hidden class do?", options: ["Makes the element smaller", "Sets the element to display: none", "Lightens the element's color", "Moves the element"], answer: 1 },
  { id: 26, question: "What does max-w-sm do?", options: ["Sets a maximum height", "Sets a small maximum width", "Sets margin", "Sets font size"], answer: 1 },
  { id: 27, question: "What is mx-auto used for?", options: ["Vertically centering an element", "Horizontally centering an element using auto margins", "Increasing padding", "Adding a border"], answer: 1 },
  { id: 28, question: "What is w-full for?", options: ["Setting width to 100%", "Setting height to 100%", "Making the page full screen", "Setting full opacity"], answer: 0 },
  { id: 29, question: "Which element is object-cover typically used on?", options: ["Buttons", "Images", "Headings", "Forms"], answer: 1 },
  { id: 30, question: "What does duration-300 mean?", options: ["300px width", "Transition speed of 300 milliseconds", "300 items", "300% opacity"], answer: 1 },
  { id: 31, question: "What is the correct breakpoint order in Tailwind?", options: ["xl, lg, md, sm", "sm, md, lg, xl", "md, sm, xl, lg", "lg, xl, sm, md"], answer: 1 },
  { id: 32, question: "In bg-blue-500/50, what does /50 represent?", options: ["50px size", "50% opacity", "50 items", "50 shade number"], answer: 1 },
  { id: 33, question: "What does flex-col do?", options: ["Arranges items in a row", "Arranges items in a column", "Hides items", "Centers items"], answer: 1 },
  { id: 34, question: "What is the tailwind.config.js file for?", options: ["Only for documentation", "For customizing Tailwind", "For storing images", "For connecting to a database"], answer: 1 },
  { id: 35, question: "Where are the @tailwind base, components, utilities directives written?", options: ["In the HTML file", "In the main CSS file", "In the JavaScript file", "In the config file"], answer: 1 },
  { id: 36, question: "What does the truncate class do?", options: ["Makes text bigger", "Cuts long text in one line with an ellipsis", "Deletes text", "Changes the text"], answer: 1 },
  { id: 37, question: "What is the disabled: prefix used for in Tailwind?", options: ["Separate styling for disabled elements", "Disabling the whole page", "Disabling JavaScript", "Removing forms"], answer: 0 },
  { id: 38, question: "What does leading-relaxed control?", options: ["Font weight", "Line height", "Letter spacing", "Text color"], answer: 1 },
  { id: 39, question: "What is the dark: prefix used for in Tailwind?", options: ["Always applying dark colors", "Giving separate styles for dark mode", "Making text bold", "Making the border darker"], answer: 1 },
  { id: 40, question: "Why does the Tailwind file size stay small in production?", options: ["All classes are automatically compressed", "Only the classes actually used are included in the final CSS", "Images get compressed", "There is less JavaScript"], answer: 1 },
]

// ─────────────────────────────────────────
// TAILWIND CSS MCQ — MARATHI
// ─────────────────────────────────────────
const tailwindQuestionsMarathi = [
  { id: 1, question: "Tailwind CSS कोणत्या प्रकारचे framework आहे?", options: ["Component-based", "Utility-first", "Object-oriented", "Template-based"], answer: 1 },
  { id: 2, question: "Tailwind कोणी बनवले?", options: ["Dan Abramov", "Adam Wathan", "Evan You", "Brendan Eich"], answer: 1 },
  { id: 3, question: "Quick testing साठी Tailwind add करण्याचा सर्वात सोपा मार्ग कोणता आहे?", options: ["npm install", "CDN link", "Download ZIP", "Git clone"], answer: 1 },
  { id: 4, question: "p-4 class ने किती padding मिळते?", options: ["4px", "16px", "8px", "40px"], answer: 1 },
  { id: 5, question: "px class कशासाठी असतो?", options: ["फक्त top padding", "Left आणि right दोन्ही padding", "फक्त bottom padding", "फक्त left padding"], answer: 1 },
  { id: 6, question: "Tailwind मध्ये प्रत्येक color चे किती shades असतात?", options: ["5", "10", "15", "20"], answer: 1 },
  { id: 7, question: "bg-blue-500 काय करते?", options: ["Text चा रंग blue करते", "Background चा रंग medium blue करते", "Border चा रंग blue करते", "Font ला blue बनवते"], answer: 1 },
  { id: 8, question: "Element ला flex container बनवण्यासाठी कोणती class वापरतात?", options: ["display-flex", "flex", "flexbox", "row"], answer: 1 },
  { id: 9, question: "justify-center कशासाठी वापरतात?", options: ["Vertical alignment", "Horizontal alignment", "Text size", "Font weight"], answer: 1 },
  { id: 10, question: "items-center कशासाठी वापरतात?", options: ["Horizontal alignment", "Vertical alignment", "Background color", "Border radius"], answer: 1 },
  { id: 11, question: "Element ला grid container बनवण्यासाठी कोणती class वापरतात?", options: ["display-grid", "grid", "gridbox", "table"], answer: 1 },
  { id: 12, question: "grid-cols-3 चा अर्थ काय आहे?", options: ["3 rows", "3 equal columns", "3px width", "3 items"], answer: 1 },
  { id: 13, question: "col-span-2 काय करते?", options: ["2 rows बनवते", "Item ला 2 columns मध्ये पसरवते", "2 items hide करते", "2px margin देते"], answer: 1 },
  { id: 14, question: "md: prefix कोणत्या screen size साठी apply होतो?", options: ["480px आणि लहान", "768px आणि मोठे", "1920px आणि मोठे", "सर्व screens"], answer: 1 },
  { id: 15, question: "Tailwind mobile-first आहे याचा अर्थ काय आहे?", options: ["फक्त mobile वर काम करते", "Default styles mobile साठी असतात मग larger screens साठी prefix लावतात", "Desktop साठी कोणताही support नाही", "Tablet सर्वात आधी येतो"], answer: 1 },
  { id: 16, question: "hover: prefix कधी trigger होतो?", options: ["Page load वर", "Mouse element वर आल्यावर", "Click केल्यावर", "Scroll केल्यावर"], answer: 1 },
  { id: 17, question: "focus: prefix कोणत्या element types वर सर्वात जास्त वापरतात?", options: ["Images", "Buttons", "Input fields", "Headings"], answer: 2 },
  { id: 18, question: "text-center काय करते?", options: ["Text bold करते", "Text center align करते", "Text चा size वाढवते", "Text underline करते"], answer: 1 },
  { id: 19, question: "font-bold काय करते?", options: ["Text चा size वाढवते", "Text bold बनवते", "Text italic बनवते", "Text center करते"], answer: 1 },
  { id: 20, question: "rounded-xl काय करते?", options: ["Border चा रंग बदलते", "Corners ला खूप round बनवते", "Element hide करते", "Width बदलते"], answer: 1 },
  { id: 21, question: "shadow-md काय करते?", options: ["Background color बदलते", "Medium box shadow देते", "Text shadow देते", "Border हटवते"], answer: 1 },
  { id: 22, question: "transition-colors कशासाठी वापरतात?", options: ["Color changes smoothly animate करण्यासाठी", "Layout बदलण्यासाठी", "Page reload करण्यासाठी", "Image resize करण्यासाठी"], answer: 0 },
  { id: 23, question: "group-hover: कसे काम करते?", options: ["फक्त parent वर apply होते", "Parent hover झाल्यावर child elements ची style बदलते", "सर्व elements एकत्र hover होतात", "काहीच करत नाही"], answer: 1 },
  { id: 24, question: "gap-4 कशासाठी वापरतात?", options: ["Margin साठी", "Flex किंवा grid items च्या मधील spacing साठी", "Font size साठी", "Border width साठी"], answer: 1 },
  { id: 25, question: "hidden class काय करते?", options: ["Element लहान बनवते", "Element ला display: none करते", "Element चा रंग हलका करते", "Element move करते"], answer: 1 },
  { id: 26, question: "max-w-sm काय करते?", options: ["Maximum height set करते", "Maximum width small set करते", "Margin set करते", "Font size set करते"], answer: 1 },
  { id: 27, question: "mx-auto कशासाठी वापरतात?", options: ["Element vertically center करण्यासाठी", "Element horizontally center करण्यासाठी (auto margins)", "Padding वाढवण्यासाठी", "Border देण्यासाठी"], answer: 1 },
  { id: 28, question: "w-full कशासाठी आहे?", options: ["Width 100% करण्यासाठी", "Height 100% करण्यासाठी", "Full screen बनवण्यासाठी", "Full opacity साठी"], answer: 0 },
  { id: 29, question: "object-cover कोणत्या element वर वापरतात?", options: ["Buttons वर", "Images वर", "Headings वर", "Forms वर"], answer: 1 },
  { id: 30, question: "duration-300 चा अर्थ काय आहे?", options: ["300px width", "300 milliseconds ची transition speed", "300 items", "300% opacity"], answer: 1 },
  { id: 31, question: "Tailwind मध्ये responsive design साठी कोणता order बरोबर आहे?", options: ["xl, lg, md, sm", "sm, md, lg, xl", "md, sm, xl, lg", "lg, xl, sm, md"], answer: 1 },
  { id: 32, question: "bg-blue-500/50 मध्ये /50 काय दाखवते?", options: ["50px size", "50% opacity", "50 items", "50 shade number"], answer: 1 },
  { id: 33, question: "flex-col काय करते?", options: ["Items row मध्ये लावते", "Items column मध्ये लावते", "Items hide करते", "Items center करते"], answer: 1 },
  { id: 34, question: "tailwind.config.js file कशासाठी आहे?", options: ["फक्त documentation साठी", "Tailwind customize करण्यासाठी", "Images store करण्यासाठी", "Database connect करण्यासाठी"], answer: 1 },
  { id: 35, question: "@tailwind base, components, utilities directives कुठे लिहतात?", options: ["HTML file मध्ये", "Main CSS file मध्ये", "JavaScript file मध्ये", "Config file मध्ये"], answer: 1 },
  { id: 36, question: "truncate class काय करते?", options: ["Text मोठा करते", "लांब text ला एका line मध्ये ... सह cut करते", "Text delete करते", "Text बदलते"], answer: 1 },
  { id: 37, question: "Tailwind मध्ये disabled: prefix कशासाठी आहे?", options: ["Disabled elements साठी वेगळी styling", "संपूर्ण page disable करण्यासाठी", "JavaScript disable करण्यासाठी", "Forms हटवण्यासाठी"], answer: 0 },
  { id: 38, question: "leading-relaxed काय control करते?", options: ["Font weight", "Line height", "Letter spacing", "Text color"], answer: 1 },
  { id: 39, question: "Tailwind मध्ये dark: prefix कशासाठी आहे?", options: ["नेहमी dark colors देण्यासाठी", "Dark mode साठी वेगळे styles देण्यासाठी", "Text bold बनवण्यासाठी", "Border गडद बनवण्यासाठी"], answer: 1 },
  { id: 40, question: "Production मध्ये Tailwind ची file size लहान का राहते?", options: ["सर्व classes आपोआप compress होतात", "फक्त actually वापरलेल्या classes final CSS मध्ये include होतात", "Images compress होतात", "JavaScript कमी असते"], answer: 1 },
]

// ─────────────────────────────────────────
// TYPESCRIPT MCQ — HINDI (paste after tailwindQuestionsMarathi)
// ─────────────────────────────────────────
const typescriptQuestions = [
  { id: 1, question: "TypeScript किसने बनाया?", options: ["Google", "Microsoft", "Facebook", "Amazon"], answer: 1 },
  { id: 2, question: "TypeScript किस year में बना?", options: ["2009", "2012", "2015", "2018"], answer: 1 },
  { id: 3, question: "TypeScript किसका superset है?", options: ["Python", "Java", "JavaScript", "C++"], answer: 2 },
  { id: 4, question: "TypeScript की सबसे बड़ी feature क्या है?", options: ["Faster execution", "Static typing", "Smaller file size", "No compilation needed"], answer: 1 },
  { id: 5, question: "TypeScript browser में directly चलता है?", options: ["हाँ", "नहीं, इसे पहले compile करना पड़ता है", "कभी-कभी", "सिर्फ Chrome में"], answer: 1 },
  { id: 6, question: "TypeScript code को JavaScript में convert करने वाली command क्या है?", options: ["ts-build", "tsc", "ts-compile", "typescript-run"], answer: 1 },
  { id: 7, question: "TypeScript file का extension क्या होता है?", options: [".js", ".ts", ".tsx only", ".type"], answer: 1 },
  { id: 8, question: "किसी भी type की value रखने वाला type कौन सा है?", options: ["unknown", "any", "mixed", "var"], answer: 1 },
  { id: 9, question: "function कुछ return नहीं करता तो उसका return type क्या लिखते हैं?", options: ["null", "undefined", "void", "none"], answer: 2 },
  { id: 10, question: "Optional parameter कैसे बनाते हैं?", options: ["parameter के पहले ! लगाकर", "parameter के बाद ? लगाकर", "parameter के बाद * लगाकर", "parameter को skip करके"], answer: 1 },
  { id: 11, question: "Object की shape define करने के लिए क्या use करते हैं?", options: ["class", "interface", "function", "module"], answer: 1 },
  { id: 12, question: "Interface में property को सिर्फ एक बार set करने देने वाला keyword कौन सा है?", options: ["const", "final", "readonly", "fixed"], answer: 2 },
  { id: 13, question: "Type alias बनाने के लिए कौन सा keyword use होता है?", options: ["alias", "type", "typedef", "define"], answer: 1 },
  { id: 14, question: "Union types में अलग types को कैसे जोड़ते हैं?", options: ["+ symbol से", "| symbol से", "& symbol से", ", से"], answer: 1 },
  { id: 15, question: "Literal type में क्या होता है?", options: ["कोई भी value allow होती है", "सिर्फ specific values allow होती हैं", "सिर्फ numbers allow होते हैं", "सिर्फ strings allow होते हैं"], answer: 1 },
  { id: 16, question: "TypeScript classes में कौन से access modifiers होते हैं?", options: ["public, private, protected", "open, closed, hidden", "global, local, scope", "static, dynamic, fixed"], answer: 0 },
  { id: 17, question: "private field को class के बाहर access करने पर क्या होता है?", options: ["कुछ नहीं होता", "Compile-time error आती है", "Runtime पर crash होता है", "Warning आती है लेकिन चलता है"], answer: 1 },
  { id: 18, question: "Generics में placeholder type कैसे लिखते हैं?", options: ["(T)", "[T]", "<T>", "{T}"], answer: 2 },
  { id: 19, question: "Generic function का फायदा क्या है?", options: ["सिर्फ numbers के साथ काम करता है", "किसी भी type के साथ काम करता है type safety के साथ", "सिर्फ strings के साथ काम करता है", "Type checking बंद कर देता है"], answer: 1 },
  { id: 20, question: "Enum किसके लिए use होता है?", options: ["Random values के लिए", "Related named constants define करने के लिए", "Functions बनाने के लिए", "Classes बनाने के लिए"], answer: 1 },
  { id: 21, question: "Default रूप से enum members किस number से शुरू होते हैं?", options: ["1", "0", "-1", "100"], answer: 1 },
  { id: 22, question: "tsconfig.json file किसलिए है?", options: ["सिर्फ documentation के लिए", "Project की TypeScript settings के लिए", "Images store करने के लिए", "Database config के लिए"], answer: 1 },
  { id: 23, question: "tsconfig.json में strict: true करने से क्या होता है?", options: ["Code तेज़ run होता है", "सभी strict type checking features enable होती हैं", "File size कम होती है", "Comments हट जाते हैं"], answer: 1 },
  { id: 24, question: "ts-node किसलिए use होता है?", options: ["File compress करने के लिए", "बिना पहले compile किए TypeScript directly run करने के लिए", "Images optimize करने के लिए", "Database से connect करने के लिए"], answer: 1 },
  { id: 25, question: "TypeScript में array का type कैसे लिख सकते हैं?", options: ["सिर्फ number[]", "सिर्फ Array<number>", "number[] या Array<number> दोनों", "इनमें से कोई नहीं"], answer: 2 },
  { id: 26, question: "TypeScript में shorthand constructor का क्या फायदा है?", options: ["Code छोटा हो जाता है, field declaration अपने आप होती है", "Functions तेज़ चलते हैं", "Errors नहीं आती कभी", "Memory कम लगती है"], answer: 0 },
  { id: 27, question: "Type inference का मतलब क्या है?", options: ["TypeScript खुद type detect कर लेता है", "हमेशा type लिखना पड़ता है", "Types कभी check नहीं होते", "सिर्फ strings के लिए काम करता है"], answer: 0 },
  { id: 28, question: "interface में readonly id: number; का क्या मतलब है?", options: ["id सिर्फ पढ़ सकते हैं चेंज नहीं कर सकते", "id हमेशा 0 होगी", "id optional है", "id string होगी"], answer: 0 },
  { id: 29, question: "TypeScript में class किस interface को implement कर सकती है?", options: ["सिर्फ एक", "एक से ज्यादा भी", "implement नहीं कर सकती", "सिर्फ built-in interfaces"], answer: 1 },
  { id: 30, question: "String enum में members की values कैसी होती हैं?", options: ["हमेशा numbers", "Specific string values", "हमेशा boolean", "Random"], answer: 1 },
  { id: 31, question: "TypeScript किन कंपनियों में use होती है?", options: ["किसी में नहीं", "सिर्फ छोटी companies में", "Microsoft, Google, Airbnb, Slack जैसी बड़ी companies में", "सिर्फ startups में"], answer: 2 },
  { id: 32, question: "Function के parameters के बाद type कैसे लिखते हैं?", options: ["Colon लगाकर", "Semicolon लगाकर", "Comma लगाकर", "Equal sign लगाकर"], answer: 0 },
  { id: 33, question: "TypeScript install करने की npm command क्या है?", options: ["npm install typescript-lang", "npm install -g typescript", "npm get typescript", "npm add ts"], answer: 1 },
  { id: 34, question: "any type ज्यादा use करना क्यों अच्छा नहीं है?", options: ["यह error देता है", "यह TypeScript के type safety फायदे को कम कर देता है", "यह slow होता है", "यह deprecated है"], answer: 1 },
  { id: 35, question: "TypeScript में class field के सामने public लिखना जरूरी है?", options: ["हाँ हमेशा", "नहीं, public default होता है", "सिर्फ constructor में जरूरी है", "सिर्फ static fields के लिए"], answer: 1 },
  { id: 36, question: "Generic interface का उदाहरण कौन सा है?", options: ["interface Box { content: any }", "interface Box<T> { content: T }", "interface Box() { content }", "interface<Box> { content }"], answer: 1 },
  { id: 37, question: "तीन access modifiers में सबसे ज्यादा restrictive कौन सा है?", options: ["public", "protected", "private", "static"], answer: 2 },
  { id: 38, question: "TypeScript compile होकर क्या बनता है?", options: ["Python code", "JavaScript code", "HTML code", "Binary code"], answer: 1 },
  { id: 39, question: "Multiple generic types कैसे लिखते हैं?", options: ["<T>", "<T, U>", "[T, U]", "(T, U)"], answer: 1 },
  { id: 40, question: "TypeScript में Status एक enum है तो Status.Completed का type क्या होगा?", options: ["string हमेशा", "number या string, enum की definition पर depend करता है", "boolean", "any"], answer: 1 },
]

// ─────────────────────────────────────────
// TYPESCRIPT MCQ — ENGLISH
// ─────────────────────────────────────────
const typescriptQuestionsEnglish = [
  { id: 1, question: "Who created TypeScript?", options: ["Google", "Microsoft", "Facebook", "Amazon"], answer: 1 },
  { id: 2, question: "In which year was TypeScript created?", options: ["2009", "2012", "2015", "2018"], answer: 1 },
  { id: 3, question: "TypeScript is a superset of which language?", options: ["Python", "Java", "JavaScript", "C++"], answer: 2 },
  { id: 4, question: "What is the biggest feature of TypeScript?", options: ["Faster execution", "Static typing", "Smaller file size", "No compilation needed"], answer: 1 },
  { id: 5, question: "Does TypeScript run directly in the browser?", options: ["Yes", "No, it must be compiled first", "Sometimes", "Only in Chrome"], answer: 1 },
  { id: 6, question: "Which command converts TypeScript code into JavaScript?", options: ["ts-build", "tsc", "ts-compile", "typescript-run"], answer: 1 },
  { id: 7, question: "What is the file extension for TypeScript files?", options: [".js", ".ts", ".tsx only", ".type"], answer: 1 },
  { id: 8, question: "Which type can hold a value of any kind?", options: ["unknown", "any", "mixed", "var"], answer: 1 },
  { id: 9, question: "What return type is used when a function returns nothing?", options: ["null", "undefined", "void", "none"], answer: 2 },
  { id: 10, question: "How do you create an optional parameter?", options: ["By adding ! before the parameter", "By adding ? after the parameter", "By adding * after the parameter", "By skipping the parameter"], answer: 1 },
  { id: 11, question: "What is used to define the shape of an object?", options: ["class", "interface", "function", "module"], answer: 1 },
  { id: 12, question: "Which keyword allows a property to be set only once?", options: ["const", "final", "readonly", "fixed"], answer: 2 },
  { id: 13, question: "Which keyword is used to create a type alias?", options: ["alias", "type", "typedef", "define"], answer: 1 },
  { id: 14, question: "How are different types joined in a union type?", options: ["With the + symbol", "With the | symbol", "With the & symbol", "With a comma"], answer: 1 },
  { id: 15, question: "What does a literal type do?", options: ["Allows any value", "Allows only specific values", "Allows only numbers", "Allows only strings"], answer: 1 },
  { id: 16, question: "Which access modifiers exist in TypeScript classes?", options: ["public, private, protected", "open, closed, hidden", "global, local, scope", "static, dynamic, fixed"], answer: 0 },
  { id: 17, question: "What happens when you try to access a private field from outside the class?", options: ["Nothing happens", "A compile-time error occurs", "It crashes at runtime", "A warning appears but it still works"], answer: 1 },
  { id: 18, question: "How do you write a placeholder type in generics?", options: ["(T)", "[T]", "<T>", "{T}"], answer: 2 },
  { id: 19, question: "What is the benefit of a generic function?", options: ["It only works with numbers", "It works with any type while keeping type safety", "It only works with strings", "It turns off type checking"], answer: 1 },
  { id: 20, question: "What is an enum used for?", options: ["Random values", "Defining a set of related named constants", "Creating functions", "Creating classes"], answer: 1 },
  { id: 21, question: "By default, what number do enum members start from?", options: ["1", "0", "-1", "100"], answer: 1 },
  { id: 22, question: "What is the tsconfig.json file for?", options: ["Only documentation", "Project's TypeScript settings", "Storing images", "Database configuration"], answer: 1 },
  { id: 23, question: "What does setting strict to true in tsconfig.json do?", options: ["Makes code run faster", "Enables all strict type-checking features", "Reduces file size", "Removes comments"], answer: 1 },
  { id: 24, question: "What is ts-node used for?", options: ["Compressing files", "Running TypeScript directly without compiling first", "Optimizing images", "Connecting to a database"], answer: 1 },
  { id: 25, question: "How can an array type be written in TypeScript?", options: ["Only number[]", "Only Array<number>", "Either number[] or Array<number>", "Neither of these"], answer: 2 },
  { id: 26, question: "What is the benefit of a shorthand constructor in TypeScript?", options: ["Code is shorter and the field is declared automatically", "Functions run faster", "Errors never happen", "It uses less memory"], answer: 0 },
  { id: 27, question: "What does type inference mean?", options: ["TypeScript automatically detects the type", "You always have to write a type", "Types are never checked", "It only works for strings"], answer: 0 },
  { id: 28, question: "What does readonly id: number; mean in an interface?", options: ["id can be read but not changed after being set", "id will always be 0", "id is optional", "id will be a string"], answer: 0 },
  { id: 29, question: "How many interfaces can a TypeScript class implement?", options: ["Only one", "More than one", "It cannot implement any", "Only built-in interfaces"], answer: 1 },
  { id: 30, question: "What kind of values do string enum members have?", options: ["Always numbers", "Specific string values", "Always booleans", "Random values"], answer: 1 },
  { id: 31, question: "Which companies use TypeScript?", options: ["None", "Only small companies", "Large companies like Microsoft, Google, Airbnb, Slack", "Only startups"], answer: 2 },
  { id: 32, question: "How is a type written after a function's parameters?", options: ["With a colon", "With a semicolon", "With a comma", "With an equals sign"], answer: 0 },
  { id: 33, question: "What is the npm command to install TypeScript globally?", options: ["npm install typescript-lang", "npm install -g typescript", "npm get typescript", "npm add ts"], answer: 1 },
  { id: 34, question: "Why isn't it good to overuse the any type?", options: ["It causes errors", "It removes the type safety benefit TypeScript provides", "It is slow", "It is deprecated"], answer: 1 },
  { id: 35, question: "Is it required to write public in front of a class field in TypeScript?", options: ["Yes, always", "No, public is the default", "Only required in the constructor", "Only for static fields"], answer: 1 },
  { id: 36, question: "Which is an example of a generic interface?", options: ["interface Box { content: any }", "interface Box<T> { content: T }", "interface Box() { content }", "interface<Box> { content }"], answer: 1 },
  { id: 37, question: "Which of the three access modifiers is the most restrictive?", options: ["public", "protected", "private", "static"], answer: 2 },
  { id: 38, question: "What does TypeScript compile into?", options: ["Python code", "JavaScript code", "HTML code", "Binary code"], answer: 1 },
  { id: 39, question: "How are multiple generic types written?", options: ["<T>", "<T, U>", "[T, U]", "(T, U)"], answer: 1 },
  { id: 40, question: "If Status is an enum, what is the type of Status.Completed?", options: ["Always string", "Either number or string, depending on the enum's definition", "Boolean", "any"], answer: 1 },
]

// ─────────────────────────────────────────
// TYPESCRIPT MCQ — MARATHI
// ─────────────────────────────────────────
const typescriptQuestionsMarathi = [
  { id: 1, question: "TypeScript कोणी बनवली?", options: ["Google", "Microsoft", "Facebook", "Amazon"], answer: 1 },
  { id: 2, question: "TypeScript कोणत्या वर्षी बनवली गेली?", options: ["2009", "2012", "2015", "2018"], answer: 1 },
  { id: 3, question: "TypeScript कोणत्या language चा superset आहे?", options: ["Python", "Java", "JavaScript", "C++"], answer: 2 },
  { id: 4, question: "TypeScript ची सर्वात मोठी feature कोणती आहे?", options: ["Faster execution", "Static typing", "Smaller file size", "No compilation needed"], answer: 1 },
  { id: 5, question: "TypeScript browser मध्ये directly चालते का?", options: ["हो", "नाही, आधी compile करावे लागते", "कधीकधी", "फक्त Chrome मध्ये"], answer: 1 },
  { id: 6, question: "TypeScript code ला JavaScript मध्ये convert करणारी command कोणती आहे?", options: ["ts-build", "tsc", "ts-compile", "typescript-run"], answer: 1 },
  { id: 7, question: "TypeScript file चा extension काय असतो?", options: [".js", ".ts", ".tsx फक्त", ".type"], answer: 1 },
  { id: 8, question: "कोणत्याही type ची value ठेवणारा type कोणता आहे?", options: ["unknown", "any", "mixed", "var"], answer: 1 },
  { id: 9, question: "function काही return करत नसेल तर त्याचा return type काय लिहतात?", options: ["null", "undefined", "void", "none"], answer: 2 },
  { id: 10, question: "Optional parameter कसे बनवतात?", options: ["parameter च्या आधी ! लावून", "parameter च्या नंतर ? लावून", "parameter च्या नंतर * लावून", "parameter skip करून"], answer: 1 },
  { id: 11, question: "Object ची shape define करण्यासाठी काय वापरतात?", options: ["class", "interface", "function", "module"], answer: 1 },
  { id: 12, question: "Interface मध्ये property फक्त एकदाच set करू देणारा keyword कोणता आहे?", options: ["const", "final", "readonly", "fixed"], answer: 2 },
  { id: 13, question: "Type alias बनवण्यासाठी कोणता keyword वापरतात?", options: ["alias", "type", "typedef", "define"], answer: 1 },
  { id: 14, question: "Union types मध्ये वेगवेगळे types कसे जोडतात?", options: ["+ symbol ने", "| symbol ने", "& symbol ने", ", ने"], answer: 1 },
  { id: 15, question: "Literal type मध्ये काय होते?", options: ["कोणतीही value allow होते", "फक्त specific values allow होतात", "फक्त numbers allow होतात", "फक्त strings allow होतात"], answer: 1 },
  { id: 16, question: "TypeScript classes मध्ये कोणते access modifiers असतात?", options: ["public, private, protected", "open, closed, hidden", "global, local, scope", "static, dynamic, fixed"], answer: 0 },
  { id: 17, question: "private field ला class च्या बाहेर access केल्यावर काय होते?", options: ["काहीच होत नाही", "Compile-time error येते", "Runtime वर crash होते", "Warning येते पण चालते"], answer: 1 },
  { id: 18, question: "Generics मध्ये placeholder type कसे लिहतात?", options: ["(T)", "[T]", "<T>", "{T}"], answer: 2 },
  { id: 19, question: "Generic function चा फायदा काय आहे?", options: ["फक्त numbers सोबत काम करतो", "कोणत्याही type सोबत type safety सह काम करतो", "फक्त strings सोबत काम करतो", "Type checking बंद करतो"], answer: 1 },
  { id: 20, question: "Enum कशासाठी वापरतात?", options: ["Random values साठी", "Related named constants define करण्यासाठी", "Functions बनवण्यासाठी", "Classes बनवण्यासाठी"], answer: 1 },
  { id: 21, question: "Default रूपात enum members कोणत्या number पासून सुरू होतात?", options: ["1", "0", "-1", "100"], answer: 1 },
  { id: 22, question: "tsconfig.json file कशासाठी आहे?", options: ["फक्त documentation साठी", "Project च्या TypeScript settings साठी", "Images store करण्यासाठी", "Database config साठी"], answer: 1 },
  { id: 23, question: "tsconfig.json मध्ये strict: true केल्याने काय होते?", options: ["Code वेगाने run होतो", "सर्व strict type checking features enable होतात", "File size कमी होते", "Comments निघून जातात"], answer: 1 },
  { id: 24, question: "ts-node कशासाठी वापरतात?", options: ["File compress करण्यासाठी", "आधी compile न करता TypeScript directly run करण्यासाठी", "Images optimize करण्यासाठी", "Database शी connect करण्यासाठी"], answer: 1 },
  { id: 25, question: "TypeScript मध्ये array चा type कसा लिहता येतो?", options: ["फक्त number[]", "फक्त Array<number>", "number[] किंवा Array<number> दोन्ही", "यापैकी काहीही नाही"], answer: 2 },
  { id: 26, question: "TypeScript मध्ये shorthand constructor चा फायदा काय आहे?", options: ["Code लहान होतो, field declaration आपोआप होते", "Functions वेगाने चालतात", "Errors कधीच येत नाहीत", "Memory कमी लागते"], answer: 0 },
  { id: 27, question: "Type inference चा अर्थ काय आहे?", options: ["TypeScript स्वतः type detect करतो", "नेहमी type लिहावे लागते", "Types कधीच check होत नाहीत", "फक्त strings साठी काम करते"], answer: 0 },
  { id: 28, question: "interface मध्ये readonly id: number; चा अर्थ काय आहे?", options: ["id फक्त वाचता येतो बदलता येत नाही", "id नेहमी 0 असेल", "id optional आहे", "id string असेल"], answer: 0 },
  { id: 29, question: "TypeScript मध्ये class किती interfaces implement करू शकते?", options: ["फक्त एक", "एकापेक्षा जास्त देखील", "implement करू शकत नाही", "फक्त built-in interfaces"], answer: 1 },
  { id: 30, question: "String enum मध्ये members च्या values कशा असतात?", options: ["नेहमी numbers", "Specific string values", "नेहमी boolean", "Random"], answer: 1 },
  { id: 31, question: "TypeScript कोणत्या companies मध्ये वापरतात?", options: ["कोणत्याच नाही", "फक्त लहान companies मध्ये", "Microsoft, Google, Airbnb, Slack सारख्या मोठ्या companies मध्ये", "फक्त startups मध्ये"], answer: 2 },
  { id: 32, question: "Function च्या parameters नंतर type कसे लिहतात?", options: ["Colon लावून", "Semicolon लावून", "Comma लावून", "Equal sign लावून"], answer: 0 },
  { id: 33, question: "TypeScript install करण्याची npm command कोणती आहे?", options: ["npm install typescript-lang", "npm install -g typescript", "npm get typescript", "npm add ts"], answer: 1 },
  { id: 34, question: "any type जास्त वापरणे का चांगले नाही?", options: ["हे error देते", "हे TypeScript च्या type safety फायद्याला कमी करते", "हे slow असते", "हे deprecated आहे"], answer: 1 },
  { id: 35, question: "TypeScript मध्ये class field च्या समोर public लिहणे आवश्यक आहे का?", options: ["हो नेहमी", "नाही, public default असतो", "फक्त constructor मध्ये आवश्यक आहे", "फक्त static fields साठी"], answer: 1 },
  { id: 36, question: "Generic interface चे उदाहरण कोणते आहे?", options: ["interface Box { content: any }", "interface Box<T> { content: T }", "interface Box() { content }", "interface<Box> { content }"], answer: 1 },
  { id: 37, question: "तीन access modifiers मध्ये सर्वात restrictive कोणता आहे?", options: ["public", "protected", "private", "static"], answer: 2 },
  { id: 38, question: "TypeScript compile होऊन काय बनते?", options: ["Python code", "JavaScript code", "HTML code", "Binary code"], answer: 1 },
  { id: 39, question: "Multiple generic types कसे लिहतात?", options: ["<T>", "<T, U>", "[T, U]", "(T, U)"], answer: 1 },
  { id: 40, question: "TypeScript मध्ये Status एक enum असेल तर Status.Completed चा type काय असेल?", options: ["नेहमी string", "number किंवा string, enum च्या definition वर depend करते", "boolean", "any"], answer: 1 },
]



/* ── Pyra mascot (shared, compact) ──────────────────────────────── */
function PyraMascot({ mood }) {
  // mood: "idle" | "correct" | "wrong"
  const eyeColor = mood === "correct" ? "#58cc02" : mood === "wrong" ? "#ff4b4b" : "#0b5394"
  const bodyColor = mood === "correct" ? "#58cc02" : mood === "wrong" ? "#ff4b4b" : "#1cb0f6"
  return (
    <svg width="52" height="64" viewBox="0 0 72 88" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <style>{`
        @keyframes antBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes blinkE  { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.08)} }
        @keyframes floatB  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .pant { animation: antBob 2s ease-in-out infinite; transform-origin: bottom center; }
        .peye { animation: blinkE 3.5s ease-in-out infinite; transform-origin: center; }
        .pbody{ animation: floatB 3s ease-in-out infinite; }
      `}</style>
      <g className="pant">
        <line x1="36" y1="10" x2="36" y2="22" stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="36" cy="8" r="4" fill={bodyColor}/>
      </g>
      <g className="pbody">
        <rect x="14" y="20" width="44" height="36" rx="12" fill={bodyColor}/>
        <rect x="19" y="26" width="34" height="24" rx="8" fill="white" opacity="0.15"/>
        <g className="peye"><rect x="22" y="32" width="10" height="10" rx="3" fill="white"/><circle cx="27" cy="37" r="3.5" fill={eyeColor}/></g>
        <g className="peye" style={{animationDelay:"0.15s"}}><rect x="40" y="32" width="10" height="10" rx="3" fill="white"/><circle cx="45" cy="37" r="3.5" fill={eyeColor}/></g>
        {mood === "correct"
          ? <path d="M28 49 Q36 55 44 49" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          : mood === "wrong"
          ? <path d="M28 53 Q36 48 44 53" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          : <rect x="29" y="47" width="14" height="3" rx="1.5" fill="white" opacity="0.7"/>
        }
        <rect x="30" y="56" width="12" height="6" rx="3" fill={bodyColor}/>
        <rect x="18" y="62" width="36" height="22" rx="10" fill={bodyColor}/>
        <circle cx="36" cy="73" r="5" fill="white" opacity="0.2"/>
        <circle cx="36" cy="73" r="3" fill="white" opacity="0.8"/>
        <rect x="6"  y="64" width="12" height="6" rx="3" fill={bodyColor}/>
        <rect x="54" y="64" width="12" height="6" rx="3" fill={bodyColor}/>
      </g>
    </svg>
  )
}

/* ── 3D press button ─────────────────────────────────────────────── */
function PressButton({ onClick, disabled, ariaLabel, bg, shadow, color, children, style = {} }) {
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        padding: "0.9rem 0.4rem",
        fontSize: "0.9rem",
        borderRadius: "12px",
        background: disabled ? "#e5e5e5" : bg,
        color: disabled ? "#aaa" : color,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: "700",
        boxShadow: (disabled || pressed) ? "none" : `0 4px 0 0 ${shadow}`,
        transform: (disabled || pressed) ? "translateY(4px)" : "translateY(0)",
        transition: "transform 0.08s, box-shadow 0.08s",
        lineHeight: 1.4,
        textAlign: "center",
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/* ── Main page ───────────────────────────────────────────────────── */
function MCQPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "दोस्त"
  const language = location.state?.language || "python"
  const instructionLang = location.state?.instructionLang || "hindi"

  const questions = instructionLang === "english"
  ? (language === "sql" ? sqlQuestionsEnglish
    : language === "javascript" ? javascriptQuestionsEnglish
    : language === "java" ? javaQuestionsEnglish
    : language === "cpp" ? cppQuestionsEnglish
    : language === "html" ? htmlQuestionsEnglish
    : language === "css" ? cssQuestionsEnglish
    : language === "tailwind" ? tailwindQuestionsEnglish
    : language === "typescript" ? typescriptQuestionsEnglish
    : pythonQuestionsEnglish)
  : instructionLang === "marathi"
  ? (language === "sql" ? sqlQuestionsMarathi
    : language === "javascript" ? javascriptQuestionsMarathi
    : language === "java" ? javaQuestionsMarathi
    : language === "cpp" ? cppQuestionsMarathi
    : language === "html" ? htmlQuestionsMarathi
    : language === "css" ? cssQuestionsMarathi
    : language === "tailwind" ? tailwindQuestionsMarathi
    : language === "typescript" ? typescriptQuestionsMarathi
    : pythonQuestionsMarathi)
  : (language === "sql" ? sqlQuestions
    : language === "javascript" ? javascriptQuestions
    : language === "java" ? javaQuestions
    : language === "cpp" ? cppQuestions
    : language === "html" ? htmlQuestions
    : language === "css" ? cssQuestions
    : language === "tailwind" ? tailwindQuestionsMarathi
    : language === "typescript" ? typescriptQuestionsMarathi
    : pythonQuestions)

  const lang = t[instructionLang]
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [step, setStep] = useState("intro")
  const [status, setStatus] = useState("")
  const [lastMessage, setLastMessage] = useState("")
  const userId = location.state?.user_id
  const [progressData, setProgressData] = useState({ lessons_done: false, mcq_done: false, agent_done: false, current_mcq_index: 0, mcq_score: 0 })
  const [listening, setListening] = useState(false)
  // "idle" | "correct" | "wrong"
  const [pyraMood, setPyraMood] = useState("idle")
  // per-option animation: null | "correct" | "wrong"
  const [optionAnim, setOptionAnim] = useState([null, null, null, null])

  const theme = useTheme()
  const {
    theme: themeMode, toggleTheme, bg, textColor, cardBg, cardBorder, borderWidth,
    mutedColor, codeBg, accent, accentText, accentSoft, accentShadow,
    success, successShadow, successText, successSoft,
    danger, dangerSoft, dangerText,
    gold, goldShadow, goldText,
    fontSize, setFontSize, speed, setSpeed,
  } = theme

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
      let preferred = null
      if (lang.voiceLang === "en-US")
        preferred = voices.find(v => v.name === "Microsoft Zira - English (United States)")
      else if (lang.voiceLang === "hi-IN")
        preferred = voices.find(v => v.name === "Google हिन्दी")
      if (!preferred) preferred = voices.find(v => v.lang === lang.voiceLang)
      if (preferred) utterance.voice = preferred
      if (onEnd) utterance.onend = onEnd
      window.speechSynthesis.speak(utterance)
    }
    if (window.speechSynthesis.getVoices().length === 0)
      window.speechSynthesis.onvoiceschanged = trySpeak
    else trySpeak()
  }

  useEffect(() => {
    if (!userId) return
    fetch(`http://127.0.0.1:8000/progress/${userId}`)
      .then(res => res.json())
      .then(data => {
        const match = data.progress?.find(p => p.language === language)
        if (match) {
          setProgressData(match)
          if (!match.mcq_done) {
            const savedIndex = match.current_mcq_index || 0
            if (savedIndex > 0 && savedIndex < questions.length) setCurrent(savedIndex)
            setScore(match.mcq_score || 0)
          }
        }
      })
      .catch(() => {})
  }, [userId, language])

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
    setOptionAnim([null, null, null, null])
    setPyraMood("idle")
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

    // Build per-option animation array
    const anim = q.options.map((_, i) => {
      if (i === index) return isCorrect ? "correct" : "wrong"
      if (!isCorrect && i === q.answer) return "reveal"
      return null
    })
    setOptionAnim(anim)

    if (isCorrect) {
      setScore(prev => prev + 1)
      setPyraMood("correct")
      speak(lang.correct + " " + lang.nextQ)
      setStatus("✅ " + lang.correct)
    } else {
      setPyraMood("wrong")
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
      const newIndex = current + 1
      setCurrent(newIndex)
      setStep("ready")
      setSelected(null)
      setOptionAnim([null, null, null, null])
      setPyraMood("idle")
      speak("अगला question तैयार है। Q दबाएं सुनने के लिए।")
      setStatus("Q = Question सुनें")
      setProgressData(prev => ({ ...prev, current_mcq_index: newIndex, mcq_score: score }))
      if (userId) {
        fetch("http://127.0.0.1:8000/progress/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, language, current_mcq_index: newIndex, mcq_score: score }),
        }).catch(() => {})
      }
    } else {
      const finalScore = score
      setPyraMood("correct")
      setProgressData(prev => ({ ...prev, mcq_done: true, mcq_score: finalScore, current_mcq_index: 0 }))
      if (userId) {
        fetch("http://127.0.0.1:8000/progress/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, language, mcq_done: true, mcq_score: finalScore, current_mcq_index: 0 }),
        }).catch(() => {})
      }
      speak(
        "बहुत शाबाश " + name + "! आपने सभी " + questions.length + " questions पूरे किए। " +
        questions.length + " में से " + finalScore + " सही जवाब दिए। " +
        "N दबाएं Code Agent पर जाने के लिए।"
      )
      setStatus("🎉 Quiz पूरा! Score: " + finalScore + "/" + questions.length + " | N = Code Agent")
      setStep("done")
    }
  }

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = lang.voiceLang
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
      if (key === "n" && step === "done")
        navigate("/agent", { state: { name, language, instructionLang, user_id: userId } })
      if (key === "n" && step !== "done") nextQuestion()
      if (key === "m") toggleTheme()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [current, step, lastMessage, score, selected])

  const q = questions[current]
  const progressPct = Math.round((current / questions.length) * 100)
  const subjectLabel = language === "sql" ? "SQL" : language === "javascript" ? "JavaScript" : "Python"

  const pageContext = instructionLang === "hindi"
    ? `प्रश्न ${current + 1} में से ${questions.length}, स्कोर ${score}`
    : instructionLang === "marathi"
    ? `प्रश्न ${current + 1} पैकी ${questions.length}, स्कोर ${score}`
    : `Question ${current + 1} of ${questions.length}, score ${score}`

  return (
    <main aria-label="MCQ Practice पृष्ठ" style={{
      minHeight: "100vh", background: bg,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem", fontSize: fontSize + "px"
    }}>
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
        @keyframes progressFill {
          from { width: 0%; }
        }
        @keyframes micPulse {
          0%   { box-shadow: 0 0 0 0 rgba(28,176,246,0.5), 0 4px 0 0 #0b8fd4; }
          70%  { box-shadow: 0 0 0 12px rgba(28,176,246,0), 0 4px 0 0 #0b8fd4; }
          100% { box-shadow: 0 0 0 0 rgba(28,176,246,0), 0 4px 0 0 #0b8fd4; }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: "1100px" }}>
        <Navbar
          {...theme}
          name={name}
          language={language}
          instructionLang={instructionLang}
          userId={userId}
          pageContext={pageContext}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem", alignItems: "start" }}>
          <div>

            {/* ── Pyra greeting card ── */}
            <div style={{
              display: "flex", alignItems: "center", gap: "1rem",
              background: cardBg,
              border: `${borderWidth} solid ${cardBorder}`,
              boxShadow: `0 2px 0 0 ${cardBorder}`,
              borderRadius: "20px",
              padding: "1rem 1.25rem",
              marginBottom: "1rem",
            }}>
              <PyraMascot mood={pyraMood} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1rem", color: textColor }}>
                  {subjectLabel} Quiz — नमस्ते {name}!
                </p>
                <p style={{ margin: "0.2rem 0 0", color: mutedColor, fontSize: "0.88rem" }}>
                  {step === "done"
                    ? `🎉 शाबाश! Score: ${score}/${questions.length}`
                    : pyraMood === "correct"
                    ? "वाह! बिल्कुल सही! ✅"
                    : pyraMood === "wrong"
                    ? "कोई बात नहीं, अगली बार! 💪"
                    : `Question ${current + 1} of ${questions.length} — Q दबाएं सुनने के लिए`
                  }
                </p>
              </div>
              {/* Score badge */}
              <div style={{
                background: accentSoft,
                border: `${borderWidth} solid ${cardBorder}`,
                borderRadius: "10px",
                padding: "0.4rem 0.8rem",
                textAlign: "center",
                flexShrink: 0,
              }}>
                <div style={{ fontSize: "1.2rem", fontWeight: "800", color: accent }}>{score}</div>
                <div style={{ fontSize: "0.7rem", color: mutedColor }}>Score</div>
              </div>
            </div>

            <ProgressBar
              lessons={progressData.lessons_done}
              mcq={progressData.mcq_done}
              agent={progressData.agent_done}
              theme={themeMode}
            />

            {/* ── Quiz progress bar ── */}
            <div style={{
              background: cardBg,
              border: `${borderWidth} solid ${cardBorder}`,
              boxShadow: `0 2px 0 0 ${cardBorder}`,
              borderRadius: "12px", padding: "0.8rem 1rem", marginBottom: "1rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ color: mutedColor, fontSize: "0.85rem" }}>Progress</span>
                <span style={{ color: success, fontSize: "0.85rem", fontWeight: "700" }}>
                  {current}/{questions.length} questions
                </span>
              </div>
              <div style={{ background: successSoft || "#e8f9e0", borderRadius: "8px", height: "10px", overflow: "hidden" }}>
                <div style={{
                  background: success,
                  width: progressPct + "%",
                  height: "10px",
                  borderRadius: "8px",
                  transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
                }} />
              </div>
            </div>

            {/* ── Question card ── */}
            <div
              aria-live="polite"
              style={{
                background: cardBg,
                border: `${borderWidth} solid ${cardBorder}`,
                boxShadow: `0 2px 0 0 ${cardBorder}`,
                padding: "1.5rem", borderRadius: "16px", marginBottom: "1rem",
              }}
            >
              <p style={{ color: mutedColor, fontSize: "0.85rem", margin: "0 0 0.5rem" }}>
                Question {q.id} of {questions.length}
              </p>
              <p style={{ color: textColor, fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.2rem", lineHeight: 1.5 }}>
                {q.question}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {q.options.map((opt, i) => {
                  const anim = optionAnim[i]
                  const isChosen = selected === i
                  const isCorrectOpt = i === q.answer

                  // Color logic
                  let borderColor = cardBorder
                  let bgColor = cardBg
                  let textCol = textColor
                  if (anim === "correct") {
                    borderColor = success
                    bgColor = successSoft || "rgba(88,204,2,0.12)"
                    textCol = successText || success
                  } else if (anim === "wrong") {
                    borderColor = danger
                    bgColor = dangerSoft || "rgba(255,75,75,0.12)"
                    textCol = dangerText || danger
                  } else if (anim === "reveal") {
                    borderColor = success
                    bgColor = successSoft || "rgba(88,204,2,0.08)"
                    textCol = successText || success
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => selectAnswer(i)}
                      aria-label={(i + 1) + ". " + opt}
                      style={{
                        padding: "0.85rem 1rem", borderRadius: "12px",
                        border: `1.5px solid ${borderColor}`,
                        textAlign: "left", cursor: step === "answered" ? "default" : "pointer",
                        fontSize: "1rem", fontWeight: "500",
                        background: bgColor,
                        color: textCol,
                        boxShadow: anim === "correct" ? `0 2px 0 0 ${successShadow || "#3a9a00"}` : "none",
                        animation: anim === "correct"
                          ? "popIn 0.35s ease-out"
                          : anim === "wrong"
                          ? "shake 0.4s ease-out"
                          : "none",
                        transition: "background 0.15s, border-color 0.15s",
                        pointerEvents: step === "answered" ? "none" : "auto",
                      }}
                      onMouseEnter={e => {
                        if (step !== "answered") e.currentTarget.style.background = accentSoft
                      }}
                      onMouseLeave={e => {
                        if (step !== "answered" && !anim) e.currentTarget.style.background = cardBg
                      }}
                    >
                      <span style={{
                        fontWeight: "800", marginRight: "0.5rem",
                        color: anim ? "inherit" : accent,
                      }}>
                        {i + 1}.
                      </span>
                      {opt}
                      {anim === "correct" && " ✅"}
                      {anim === "wrong" && " ❌"}
                      {anim === "reveal" && " ← सही जवाब"}
                    </button>
                  )
                })}
              </div>

              {status !== "" && (
                <p
                  aria-live="assertive"
                  style={{
                    marginTop: "1rem",
                    color: pyraMood === "correct" ? success : pyraMood === "wrong" ? danger : accent,
                    fontSize: "0.9rem",
                    background: pyraMood === "correct" ? (successSoft || "rgba(88,204,2,0.1)") : pyraMood === "wrong" ? (dangerSoft || "rgba(255,75,75,0.1)") : accentSoft,
                    border: `${borderWidth} solid ${cardBorder}`,
                    padding: "0.5rem 1rem", borderRadius: "8px", margin: "1rem 0 0",
                  }}
                >
                  {status}
                </p>
              )}
            </div>

            {/* ── Action buttons ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.8rem" }}>

              {/* Q — Listen */}
              <PressButton
                onClick={playQuestion}
                ariaLabel="Q — Question सुनें"
                bg={accent}
                shadow={accentShadow || "#0b8fd4"}
                color={accentText}
              >
                🔊 सुनें<br /><span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(Q)</span>
              </PressButton>

              {/* R — Repeat */}
              <PressButton
                onClick={() => speak(lastMessage)}
                ariaLabel="R — दोबारा सुनें"
                bg={accentSoft}
                shadow={accentShadow || "#0b8fd4"}
                color={accent}
              >
                🔁 दोबारा<br /><span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(R)</span>
              </PressButton>

              {/* T — Voice answer (mic with pulse) */}
              <button
                onClick={startListening}
                disabled={listening}
                aria-label="T — आवाज़ से जवाब दें"
                style={{
                  padding: "0.9rem 0.4rem",
                  fontSize: "0.9rem",
                  borderRadius: "12px",
                  background: listening ? accentSoft : accent,
                  color: listening ? accent : accentText,
                  border: "none",
                  cursor: listening ? "not-allowed" : "pointer",
                  fontWeight: "700",
                  lineHeight: 1.4,
                  textAlign: "center",
                  animation: listening ? "micPulse 1.2s ease-out infinite" : "none",
                  boxShadow: `0 4px 0 0 ${accentShadow || "#0b8fd4"}`,
                  transition: "background 0.15s",
                }}
              >
                {listening ? "🎙️ सुन रही हूँ" : "🎤 बोलें"}<br />
                <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(T)</span>
              </button>

              {/* N — Next / Agent */}
              <PressButton
                onClick={
                  step === "done"
                    ? () => navigate("/agent", { state: { name, language, instructionLang, user_id: userId } })
                    : nextQuestion
                }
                ariaLabel="N — अगला question"
                bg={step === "done" ? gold : success}
                shadow={step === "done" ? (goldShadow || "#c49a00") : (successShadow || "#3a9a00")}
                color={step === "done" ? (goldText || "#fff") : (successText || "#fff")}
              >
                {step === "done" ? "🏆 Agent" : "अगला →"}<br />
                <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(N)</span>
              </PressButton>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default MCQPage