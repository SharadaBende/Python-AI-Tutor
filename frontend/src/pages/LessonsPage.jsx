import { t } from "../components/translations"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import ProgressBar from "../components/ProgressBar"
import LessonSidebar from "../components/LessonSidebar"
import Navbar from "../components/Navbar"
import { useTheme } from "../components/useTheme"

const pythonLessons = [
  { id: 1, title: "Python क्या है?", content: "Python एक programming language है। सरल भाषा में कहें तो — Python एक तरीका है जिससे हम computer को instructions देते हैं। जैसे हम किसी को हिंदी में बोलते हैं, वैसे ही हम computer को Python में बोलते हैं। Python को 1991 में Guido van Rossum नाम के एक scientist ने बनाया था। Python इसलिए खास है क्योंकि इसे पढ़ना और समझना बहुत आसान है। Python से हम websites बना सकते हैं, games बना सकते हैं, AI बना सकते हैं, और data analysis कर सकते हैं। दुनिया की बड़ी companies जैसे Google, Netflix, और Instagram भी Python use करती हैं।", example: null },
  { id: 2, title: "print() function", content: "print() function Python का सबसे पहला और सबसे जरूरी function है। print का मतलब है — screen पर कुछ दिखाना। जो भी हम print के brackets के अंदर लिखते हैं, वो computer की screen पर दिख जाता है। जैसे अगर हम print नमस्ते लिखें, तो screen पर नमस्ते दिखेगा। Text लिखते समय उसे quotes के अंदर लिखना जरूरी है। हम numbers भी print कर सकते हैं, और दो चीज़ें एक साथ भी print कर सकते हैं। print() function हर Python programmer रोज़ use करता है।", example: 'print("नमस्ते दुनिया!")\nprint(42)\nprint("मेरा नाम", "Pyra", "है")' },
  { id: 3, title: "Variables", content: "Variable को हम एक डिब्बे की तरह सोच सकते हैं। जैसे घर में अलग अलग डिब्बों में चीनी, नमक, और चावल रखते हैं, वैसे ही computer में अलग अलग variables में अलग अलग data रखते हैं। हर variable का एक नाम होता है। उस नाम से हम उस data को बाद में use कर सकते हैं। जैसे naam नाम के variable में Sharada रखा, तो जब भी naam लिखेंगे, Sharada मिलेगा। Variable बनाने के लिए पहले नाम लिखो, फिर equal sign, फिर value। Variable का नाम हमेशा छोटे अक्षरों में लिखते हैं और बीच में space नहीं होती।", example: 'naam = "Sharada"\numar = 20\nsheher = "Mumbai"\nprint(naam)\nprint(umar)\nprint(sheher)' },
  { id: 4, title: "Data Types", content: "Python में अलग अलग तरह का data होता है, जिन्हें Data Types कहते हैं। पहला है int यानी पूरी संख्या जैसे 5, 10, 100। दूसरा है float यानी दशमलव संख्या जैसे 3.14, 5.5। तीसरा है string यानी text जैसे नमस्ते, Sharada। string हमेशा quotes के अंदर लिखते हैं। चौथा है bool जिसमें सिर्फ दो values होती हैं — True या False। जैसे क्या आज बारिश है? True या False। Python खुद समझ लेता है कि कौन सा data type है। हमें अलग से बताना नहीं पड़ता। यह Python की सबसे अच्छी खासियत है।", example: 'umar = 20\nlambaai = 5.6\nnaam = "Pyra"\nkya_student_hai = True\nprint(umar)\nprint(lambaai)\nprint(naam)\nprint(kya_student_hai)' },
  { id: 5, title: "User से Input लेना", content: "अब तक हमने सिर्फ खुद data लिखा। लेकिन real programs में user से data लेना पड़ता है। इसके लिए Python में input() function होता है। input() function screen पर एक सवाल दिखाता है और user का जवाब सुनता है। जो भी user type करता है वो एक variable में save हो जाता है। जैसे अगर हम पूछें आपका नाम क्या है, तो user जो नाम type करेगा वो naam variable में save हो जाएगा। फिर हम उस naam को print कर सकते हैं। यह बहुत जरूरी है क्योंकि हर app में user से कुछ न कुछ लेना पड़ता है।", example: 'naam = input("आपका नाम क्या है? ")\numar = input("आपकी उम्र क्या है? ")\nprint("नमस्ते", naam)\nprint("आपकी उम्र है", umar)' },
  { id: 6, title: "If/Else Conditions", content: "If/Else से हम computer को decision लेना सिखाते हैं। जैसे हम सोचते हैं — अगर बारिश है तो छाता लो, नहीं तो धूप का चश्मा लो। वैसे ही Python में if लिखकर condition लिखते हैं। अगर condition सही है तो if वाला code चलता है। अगर condition गलत है तो else वाला code चलता है। Condition में हम greater than, less than, equal to जैसे operators use करते हैं। if के बाद colon लगाना जरूरी है और अगली line में 4 spaces का indentation देना जरूरी है। यह Python का बहुत important concept है।", example: 'umar = 18\nif umar >= 18:\n    print("आप vote कर सकते हैं")\nelse:\n    print("आप vote नहीं कर सकते")\n\nnumber = 10\nif number > 0:\n    print("यह positive number है")\nelse:\n    print("यह negative number है")' },
  { id: 7, title: "For Loop", content: "For loop से हम कोई काम बार बार करवा सकते हैं। जैसे अगर हमें 1 से 100 तक गिनना हो तो क्या हम 100 बार print लिखेंगे? नहीं! इसके लिए for loop use करते हैं। for loop में range() function use होता है। range(1, 6) का मतलब है 1 से 5 तक। हर बार loop चलने पर i की value बदलती है। पहली बार i=1, दूसरी बार i=2, और ऐसे आगे बढ़ता है। for loop का use list के हर item पर काम करने के लिए भी होता है। यह programming का सबसे important concept है।", example: "for i in range(1, 6):\n    print(i)\n\nfor i in range(1, 11):\n    print(i, 'का square है', i*i)" },
  { id: 8, title: "While Loop", content: "While loop तब तक चलता है जब तक कोई condition सही हो। जैसे — जब तक पानी न मिले, चलते रहो। यह for loop से अलग है। for loop में हम पहले से जानते हैं कि कितनी बार चलेगा। while loop में condition पर depend करता है। while loop में एक बात बहुत जरूरी है — loop के अंदर कुछ ऐसा होना चाहिए जो condition को eventually false बना दे। नहीं तो loop हमेशा चलता रहेगा जिसे infinite loop कहते हैं। count = count + 1 इसीलिए लिखते हैं ताकि loop बंद हो जाए।", example: "count = 1\nwhile count <= 5:\n    print(count)\n    count = count + 1\n\npassword = ''\nwhile password != 'hello':\n    password = input('Password डालें: ')\nprint('सही password!')" },
  { id: 9, title: "Lists", content: "List एक थैले की तरह है जिसमें हम कई चीज़ें एक साथ रख सकते हैं। जैसे एक थैले में सेब, केला, और आम रखते हैं, वैसे ही list में कई values रख सकते हैं। List square brackets में लिखी जाती है और items को comma से अलग करते हैं। List में हर item का एक number होता है जिसे index कहते हैं। Index हमेशा 0 से शुरू होता है। यानी पहला item index 0 पर है, दूसरा index 1 पर। len() function से list की length यानी कितने items हैं यह पता चलता है। List में नए items add कर सकते हैं, हटा सकते हैं, और बदल सकते हैं।", example: 'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])\nprint(fruits[1])\nprint(len(fruits))\nfruits.append("orange")\nprint(fruits)' },
  { id: 10, title: "Functions", content: "Function एक छोटा program होता है जो एक specific काम करता है। Function का सबसे बड़ा फायदा है कि एक बार लिखो और बार बार use करो। जैसे TV का remote एक function है — उसे एक बार बनाया और बार बार use करते हैं। def keyword से function बनाते हैं। def के बाद function का नाम लिखते हैं, फिर brackets में parameters। Parameters वो values हैं जो हम function को देते हैं। Function के अंदर का code तब चलता है जब हम function को call करते हैं। Function call करने के लिए function का नाम और brackets लिखते हैं।", example: 'def namaste(naam):\n    print("नमस्ते", naam, "जी!")\n\ndef add(a, b):\n    result = a + b\n    print(a, "+", b, "=", result)\n\nnamaste("Sharada")\nnamaste("Pyra")\nadd(5, 3)\nadd(10, 20)' },
  { id: 11, title: "String Operations", content: "String यानी text के साथ हम बहुत कुछ कर सकते हैं। दो strings को जोड़ने के लिए plus operator use करते हैं। upper() से सभी अक्षर बड़े हो जाते हैं। lower() से सभी अक्षर छोटे हो जाते हैं। len() से string की length पता चलती है। replace() से किसी word को बदल सकते हैं। split() से string को parts में तोड़ सकते हैं। in keyword से check कर सकते हैं कि कोई word string में है या नहीं। String operations बहुत useful हैं क्योंकि real programs में text के साथ बहुत काम करना पड़ता है।", example: 'naam = "sharada"\nprint(naam.upper())\nprint(naam.lower())\nprint(len(naam))\nprint("नमस्ते " + naam)\nprint(naam.replace("sharada", "pyra"))\nprint("sha" in naam)' },
  { id: 12, title: "Math Operations", content: "Python एक बहुत अच्छा calculator भी है। जोड़ के लिए plus, घटाव के लिए minus, गुणा के लिए star, भाग के लिए slash use करते हैं। शेषफल यानी remainder के लिए percent sign use होता है। Double star से power निकाल सकते हैं जैसे 2 की power 3 यानी 8। Double slash से floor division होता है जो भाग के बाद decimal हटा देता है। Python में math module भी होता है जिससे square root, trigonometry जैसी calculations कर सकते हैं। Calculator बनाने में यही सब operations काम आते हैं।", example: "a = 10\nb = 3\nprint('जोड़:', a + b)\nprint('घटाव:', a - b)\nprint('गुणा:', a * b)\nprint('भाग:', a / b)\nprint('शेषफल:', a % b)\nprint('घात:', 2 ** 10)" },
  { id: 13, title: "Comments", content: "Comments वो lines होती हैं जो Python run नहीं करता। Comments सिर्फ हम developers के लिए होते हैं — code को समझाने के लिए। जैसे किताब में notes लिखते हैं, वैसे ही code में comments लिखते हैं। Hash symbol यानी # से single line comment बनाते हैं। # के बाद जो भी लिखो Python ignore करता है। Comments लिखना बहुत जरूरी है क्योंकि बाद में जब हम अपना code दोबारा पढ़ें या कोई दूसरा पढ़े तो समझ आए। अच्छे programmers हमेशा comments लिखते हैं।", example: "# यह एक simple calculator है\na = 10  # पहला number\nb = 5   # दूसरा number\n\n# जोड़ करते हैं\nresult = a + b\nprint('जोड़:', result)  # result print करो" },
  { id: 14, title: "Error Handling", content: "जब Python को कोई गलती मिलती है तो program बंद हो जाता है। लेकिन real apps में हम नहीं चाहते कि program बंद हो। इसके लिए try और except use करते हैं। try के अंदर वो code लिखते हैं जिसमें error आ सकती है। अगर error आए तो except वाला code चलता है और program बंद नहीं होता। जैसे अगर हम किसी number को zero से divide करें तो error आती है। try/except से हम वो error पकड़ कर user को एक अच्छा message दे सकते हैं। यह professional programming का बहुत important हिस्सा है।", example: "try:\n    result = 10 / 0\n    print(result)\nexcept ZeroDivisionError:\n    print('गलती! शून्य से भाग नहीं होता')\n\ntry:\n    number = int('hello')\nexcept ValueError:\n    print('गलती! यह number नहीं है')" },
  { id: 15, title: "Mini Project — Calculator", content: "शाबाश! आपने Python के सभी basic concepts सीख लिए। अब हम इन सब को मिलाकर एक real calculator बनाएंगे। इस calculator में हम functions use करेंगे, if/else conditions use करेंगे, और variables use करेंगे। यह आपका पहला Python project है। इसे बनाने के बाद आप कह सकते हैं कि मैंने Python में एक program बनाया है। यह calculator दो numbers लेता है, operation पूछता है, और result देता है। आगे चलकर आप इसे और बेहतर बना सकते हैं।", example: 'def calculator(a, b, operation):\n    if operation == "+":\n        return a + b\n    elif operation == "-":\n        return a - b\n    elif operation == "*":\n        return a * b\n    elif operation == "/":\n        if b != 0:\n            return a / b\n        else:\n            return "शून्य से भाग नहीं होता"\n    else:\n        return "गलत operation"\n\nprint(calculator(10, 5, "+"))\nprint(calculator(10, 5, "-"))\nprint(calculator(10, 5, "*"))\nprint(calculator(10, 5, "/"))' },
   
]

const pythonLessonsEnglish = [
  { id: 1, title: "What is Python?", content: "Python is a programming language. In simple words, Python is a way to give instructions to a computer. Just like we speak to people in English, we speak to computers in Python. Python was created in 1991 by a scientist named Guido van Rossum. Python is special because it is very easy to read and understand. With Python we can build websites, games, artificial intelligence, and analyze data. Big companies like Google, Netflix, and Instagram also use Python. Python is the best language for beginners.", example: null },
  { id: 2, title: "print() function", content: "The print() function is the first and most important function in Python. print means to show something on the screen. Whatever we write inside the brackets of print appears on the computer screen. For example if we write print Hello, then Hello will appear on the screen. When printing text we must put it inside quotes. We can also print numbers and we can print multiple things at the same time. Every Python programmer uses the print() function every single day.", example: 'print("Hello World!")\nprint(42)\nprint("My name is", "Pyra")' },
  { id: 3, title: "Variables", content: "We can think of a variable as a box or container. Just like we keep sugar in one container, salt in another, and rice in another, we keep different data in different variables. Every variable has a name. Using that name we can access the data later. For example if we store Sharada in a variable called name, then whenever we write name we get Sharada. To create a variable write the name first, then an equal sign, then the value. Variable names are always in lowercase and cannot have spaces.", example: 'name = "Sharada"\nage = 20\ncity = "Mumbai"\nprint(name)\nprint(age)\nprint(city)' },
  { id: 4, title: "Data Types", content: "Python has different kinds of data called Data Types. The first is int which means a whole number like 5, 10, or 100. The second is float which means a decimal number like 3.14 or 5.5. The third is string which means text like Hello or Sharada. Strings must always be written inside quotes. The fourth is bool which has only two values — True or False. For example is it raining today? True or False. Python automatically understands which data type you are using. You do not need to tell Python separately. This is one of the best features of Python.", example: 'age = 20\nheight = 5.6\nname = "Pyra"\nis_student = True\nprint(age)\nprint(height)\nprint(name)\nprint(is_student)' },
  { id: 5, title: "Taking Input from User", content: "So far we have only written data ourselves. But in real programs we need to take data from the user. For this Python has the input() function. The input() function shows a question on the screen and waits for the user to type an answer. Whatever the user types gets saved into a variable. For example if we ask What is your name, the name the user types will be saved in the name variable. Then we can print that name. This is very important because every app needs to take some input from the user.", example: 'name = input("What is your name? ")\nage = input("What is your age? ")\nprint("Hello", name)\nprint("Your age is", age)' },
  { id: 6, title: "If/Else Conditions", content: "If and Else teach the computer how to make decisions. Just like we think — if it is raining take an umbrella, otherwise take sunglasses. In Python we write if followed by a condition. If the condition is true the if block runs. If the condition is false the else block runs. We use operators like greater than, less than, and equal to in conditions. After if we must write a colon and the next line must have 4 spaces of indentation. This is a very important concept in Python.", example: 'age = 18\nif age >= 18:\n    print("You can vote")\nelse:\n    print("You cannot vote")\n\nnumber = 10\nif number > 0:\n    print("This is a positive number")\nelse:\n    print("This is a negative number")' },
  { id: 7, title: "For Loop", content: "A for loop lets us repeat a task many times. If we need to count from 1 to 100 would we write print 100 times? No! We use a for loop. The range() function is used inside a for loop. range(1, 6) means from 1 to 5. Every time the loop runs the value of i changes. First time i is 1, second time i is 2, and so on. For loops are also used to work with every item in a list. This is one of the most important concepts in programming.", example: "for i in range(1, 6):\n    print(i)\n\nfor i in range(1, 11):\n    print(i, 'squared is', i*i)" },
  { id: 8, title: "While Loop", content: "A while loop runs as long as a condition is true. For example — keep walking until you find water. This is different from a for loop. In a for loop we know in advance how many times it will run. In a while loop it depends on the condition. One very important thing about while loops — something inside the loop must eventually make the condition false. Otherwise the loop will run forever which is called an infinite loop. That is why we write count = count + 1 so the loop eventually stops.", example: "count = 1\nwhile count <= 5:\n    print(count)\n    count = count + 1" },
  { id: 9, title: "Lists", content: "A list is like a bag where we can keep many things together. Just like a bag can hold apples, bananas, and mangoes together, a list can hold many values together. Lists are written inside square brackets and items are separated by commas. Every item in a list has a number called an index. Index always starts from 0. So the first item is at index 0, the second item is at index 1. The len() function tells us how many items are in the list. We can add items, remove items, and change items in a list.", example: 'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])\nprint(fruits[1])\nprint(len(fruits))\nfruits.append("orange")\nprint(fruits)' },
  { id: 10, title: "Functions", content: "A function is a small program that does one specific job. The biggest advantage of a function is write once and use many times. Think of a TV remote as a function — it was made once and we use it again and again. We use the def keyword to create a function. After def we write the function name, then brackets with parameters. Parameters are the values we give to the function. The code inside the function runs when we call the function. To call a function we write the function name and brackets.", example: 'def greet(name):\n    print("Hello", name, "!")\n\ndef add(a, b):\n    result = a + b\n    print(a, "+", b, "=", result)\n\ngreet("Sharada")\ngreet("Pyra")\nadd(5, 3)\nadd(10, 20)' },
  { id: 11, title: "String Operations", content: "We can do many things with strings which are text values. To join two strings we use the plus operator. upper() makes all letters uppercase. lower() makes all letters lowercase. len() tells us how many characters are in the string. replace() lets us replace one word with another. split() breaks the string into parts. The in keyword checks if a word exists in the string. String operations are very useful because real programs work with text all the time.", example: 'name = "sharada"\nprint(name.upper())\nprint(name.lower())\nprint(len(name))\nprint("Hello " + name)\nprint(name.replace("sharada", "pyra"))\nprint("sha" in name)' },
  { id: 12, title: "Math Operations", content: "Python is also a great calculator. We use plus for addition, minus for subtraction, star for multiplication, and slash for division. Percent sign gives the remainder after division. Double star is used for power, so 2 double star 3 gives 8. Double slash gives floor division which removes the decimal part. Python also has a math module for advanced calculations like square root and trigonometry. All of these are used when building calculators and scientific programs.", example: "a = 10\nb = 3\nprint('Addition:', a + b)\nprint('Subtraction:', a - b)\nprint('Multiplication:', a * b)\nprint('Division:', a / b)\nprint('Remainder:', a % b)\nprint('Power:', 2 ** 10)" },
  { id: 13, title: "Comments", content: "Comments are lines that Python does not run. Comments are only for us developers to explain the code. Just like we write notes in a book, we write comments in code. We use the hash symbol to create a single line comment. Everything after the hash symbol on that line is ignored by Python. Writing comments is very important because when we read our code later or someone else reads it they should be able to understand it easily. Good programmers always write comments.", example: "# This is a simple calculator\na = 10  # first number\nb = 5   # second number\n\n# Let us add them\nresult = a + b\nprint('Addition:', result)" },
  { id: 14, title: "Error Handling", content: "When Python finds a mistake it stops the program. But in real apps we do not want the program to stop. For this we use try and except. We write code that might cause an error inside the try block. If an error happens the except block runs and the program does not crash. For example if we divide a number by zero Python gives an error. With try and except we can catch that error and show the user a nice message instead. This is a very important part of professional programming.", example: "try:\n    result = 10 / 0\n    print(result)\nexcept ZeroDivisionError:\n    print('Error! Cannot divide by zero')\n\ntry:\n    number = int('hello')\nexcept ValueError:\n    print('Error! This is not a number')" },
  { id: 15, title: "Mini Project — Calculator", content: "Congratulations! You have learned all the basic concepts of Python. Now we will combine everything to build a real calculator. This calculator will use functions, if and else conditions, and variables. This is your first Python project. After building this you can say that you have built a program in Python. This calculator takes two numbers, asks for the operation, and gives the result. In the future you can make it even better.", example: 'def calculator(a, b, operation):\n    if operation == "+":\n        return a + b\n    elif operation == "-":\n        return a - b\n    elif operation == "*":\n        return a * b\n    elif operation == "/":\n        if b != 0:\n            return a / b\n        else:\n            return "Cannot divide by zero"\n    else:\n        return "Invalid operation"\n\nprint(calculator(10, 5, "+"))\nprint(calculator(10, 5, "-"))\nprint(calculator(10, 5, "*"))\nprint(calculator(10, 5, "/"))' },
]



// ✅ Paste this BEFORE `const sqlLessons` in your LessonsPage.jsx

const pythonLessonsMarathi = [
  { id: 1, title: "Python म्हणजे काय?", content: "Python ही एक programming language आहे. सोप्या भाषेत सांगायचे तर — Python हा एक मार्ग आहे ज्याने आपण computer ला सूचना देतो. जसे आपण एखाद्या माणसाशी मराठीत बोलतो, तसेच आपण computer शी Python मध्ये बोलतो. Python 1991 साली Guido van Rossum नावाच्या एका शास्त्रज्ञाने बनवली होती. Python खास आहे कारण ती वाचायला आणि समजायला खूप सोपी आहे. Python सारखी दिसते ती जवळजवळ इंग्रजी भाषेसारखीच असते. Python वापरून आपण websites बनवू शकतो, games बनवू शकतो, Artificial Intelligence बनवू शकतो, आणि data analysis करू शकतो. जगातील मोठ्या companies जसे Google, Netflix, आणि Instagram देखील Python वापरतात. Python ही beginners साठी सर्वात चांगली programming language आहे कारण तिचे rules खूप सोपे आहेत. आपण या course मध्ये Python शिकणार आहोत आणि स्वतःचे programs बनवणार आहोत.", example: null },
  { id: 2, title: "print() function", content: "print() function हे Python मधील सर्वात पहिले आणि सर्वात महत्त्वाचे function आहे. print चा अर्थ आहे — screen वर काहीतरी दाखवणे. आपण print च्या brackets च्या आत जे काही लिहितो ते computer च्या screen वर दिसते. उदाहरणार्थ जर आपण print नमस्कार लिहिले तर screen वर नमस्कार दिसेल. Text लिहिताना त्याला quotes च्या आत लिहणे आवश्यक आहे. आपण numbers देखील print करू शकतो आणि एकाच वेळी दोन गोष्टी एकत्र print करू शकतो. print() function मध्ये comma वापरून अनेक गोष्टी एका ओळीत print करता येतात. प्रत्येक Python programmer रोज print() function वापरतो. हे function debugging साठी देखील खूप उपयुक्त आहे म्हणजे program मध्ये काय चालू आहे हे तपासण्यासाठी.", example: 'print("नमस्कार जग!")\nprint(42)\nprint("माझे नाव", "Pyra", "आहे")\nprint("आज", 2024, "साल आहे")' },
  { id: 3, title: "Variables", content: "Variable ला आपण एक डबा किंवा खोकं समजू शकतो. जसे घरात वेगवेगळ्या डब्यांमध्ये साखर, मीठ, आणि तांदूळ ठेवतो, तसेच computer मध्ये वेगवेगळ्या variables मध्ये वेगवेगळा data ठेवतो. प्रत्येक variable ला एक नाव असते. त्या नावाने आपण तो data नंतर वापरू शकतो. उदाहरणार्थ naam नावाच्या variable मध्ये Sharada ठेवले, तर जेव्हाही naam लिहू तेव्हा Sharada मिळेल. Variable बनवण्यासाठी आधी नाव लिहा, मग equal sign, मग value. Variable चे नाव नेहमी लहान अक्षरांमध्ये लिहतात आणि मध्ये space नसते. जर नावात दोन शब्द असतील तर underscore वापरतात जसे my_name. Variable ची value नंतर बदलता येते. एकदा variable बनवला की तो program संपेपर्यंत आपल्याला वापरता येतो.", example: 'naam = "Sharada"\nvay = 20\nshahar = "Pune"\nprint(naam)\nprint(vay)\nprint(shahar)' },
  { id: 4, title: "Data Types", content: "Python मध्ये वेगवेगळ्या प्रकारचा data असतो ज्यांना Data Types म्हणतात. पहिला आहे int म्हणजे पूर्ण संख्या जसे 5, 10, 100, 1000. दुसरा आहे float म्हणजे दशांश संख्या जसे 3.14, 5.5, 9.99. तिसरा आहे string म्हणजे text जसे नमस्कार, Sharada, Pune. string नेहमी quotes च्या आत लिहतात. चौथा आहे bool ज्यामध्ये फक्त दोन values असतात — True किंवा False. उदाहरणार्थ आज पाऊस आहे का? True किंवा False. Python स्वतः समजते की कोणता data type आहे. आपल्याला वेगळे सांगायची गरज नाही. हे Python ची सर्वात चांगली खासियत आहे. type() function वापरून आपण कोणत्याही variable चा data type तपासू शकतो.", example: 'vay = 20\nunchaai = 5.6\nnaam = "Pyra"\nkya_vidyarthi_ahe = True\nprint(vay)\nprint(unchaai)\nprint(naam)\nprint(kya_vidyarthi_ahe)\nprint(type(vay))\nprint(type(naam))' },
  { id: 5, title: "User कडून Input घेणे", content: "आतापर्यंत आपण स्वतःच data लिहिला. पण real programs मध्ये user कडून data घ्यावा लागतो. यासाठी Python मध्ये input() function आहे. input() function screen वर एक प्रश्न दाखवतो आणि user चे उत्तर ऐकतो. user जे काही type करतो ते एका variable मध्ये save होते. उदाहरणार्थ जर आपण विचारले तुमचे नाव काय आहे, तर user जे नाव type करेल ते naam variable मध्ये save होईल. मग आपण तो naam print करू शकतो. हे खूप महत्त्वाचे आहे कारण प्रत्येक app मध्ये user कडून काही ना काही घ्यावे लागते. एक महत्त्वाची गोष्ट — input() function नेहमी string देते. जर आपल्याला number हवे असेल तर int() किंवा float() वापरून convert करावे लागते.", example: 'naam = input("तुमचे नाव काय आहे? ")\nvay = int(input("तुमचे वय किती आहे? "))\nprint("नमस्कार", naam)\nprint("तुमचे वय आहे", vay)\nprint("10 वर्षांनी तुम्ही", vay + 10, "वर्षांचे असाल")' },
  { id: 6, title: "If/Else Conditions", content: "If/Else ने आपण computer ला निर्णय घेण्यास शिकवतो. जसे आपण विचार करतो — जर पाऊस असेल तर छत्री घे, नाहीतर उन्हाचा चष्मा घे. तसेच Python मध्ये if लिहून condition लिहतो. जर condition बरोबर असेल तर if वाला code चालतो. जर condition चुकीची असेल तर else वाला code चालतो. Condition मध्ये आपण greater than, less than, equal to असे operators वापरतो. if च्या नंतर colon लावणे आवश्यक आहे आणि पुढच्या ओळीत 4 spaces चे indentation देणे आवश्यक आहे. elif वापरून अनेक conditions तपासता येतात. elif म्हणजे else if. आपण एकाच वेळी if, elif, आणि else एकत्र वापरू शकतो. हे Python चा खूप महत्त्वाचा concept आहे.",example: 'vay = 18\nif vay >= 18:\n    print("तुम्ही मतदान करू शकता")\nelse:\n    print("तुम्ही मतदान करू शकत नाही")\n\nmarks = 75\nif marks >= 90:\n    print("Grade: A")\nelif marks >= 75:\n    print("Grade: B")\nelif marks >= 60:\n    print("Grade: C")\nelse:\n    print("Grade: F")' },
  { id: 7, title: "For Loop", content: "For loop ने आपण एखादे काम अनेक वेळा करवू शकतो. जर आपल्याला 1 ते 100 पर्यंत मोजायचे असेल तर काय आपण 100 वेळा print लिहणार? नाही! यासाठी for loop वापरतो. for loop मध्ये range() function वापरतात. range(1, 6) चा अर्थ आहे 1 ते 5 पर्यंत. प्रत्येक वेळी loop चालल्यावर i ची value बदलते. पहिल्यांदा i=1, दुसऱ्यांदा i=2, आणि असे पुढे जाते. for loop चा उपयोग list च्या प्रत्येक item वर काम करण्यासाठी देखील होतो. range() मध्ये तिसरा parameter step असतो. जसे range(0, 10, 2) म्हणजे 0, 2, 4, 6, 8 — दोन दोन करून. Loops हे programming चे सर्वात महत्त्वाचे concept आहे.", example: "for i in range(1, 6):\n    print(i)\n\nfor i in range(1, 11):\n    print(i, 'चा square आहे', i*i)\n\nfor i in range(10, 0, -1):\n    print(i, '...')\nprint('सुरुवात!')" },
  { id: 8, title: "While Loop", content: "While loop तोपर्यंत चालतो जोपर्यंत एखादी condition बरोबर असते. जसे — जोपर्यंत पाणी मिळत नाही तोपर्यंत चालत राहा. हे for loop पेक्षा वेगळे आहे. for loop मध्ये आपल्याला आधीच माहीत असते की किती वेळा चालेल. while loop मध्ये condition वर अवलंबून असते. while loop बद्दल एक गोष्ट खूप महत्त्वाची आहे — loop च्या आत असे काहीतरी असायला हवे जे condition ला eventually false करेल. नाहीतर loop नेहमी चालत राहील ज्याला infinite loop म्हणतात. count = count + 1 म्हणूनच लिहतो जेणेकरून loop बंद होईल. while loop password check करण्यासाठी, game मध्ये, आणि user input घेण्यासाठी खूप उपयुक्त आहे.", example: "count = 1\nwhile count <= 5:\n    print(count)\n    count = count + 1\n\npassword = ''\nwhile password != 'hello':\n    password = input('Passwor d टाका: ')\nprint('बरोबर password!')"},
  { id: 9, title: "Lists", content: "List एखाद्या पिशवीसारखी आहे ज्यात आपण अनेक गोष्टी एकत्र ठेवू शकतो. जसे एका पिशवीत सफरचंद, केळे, आणि आंबा ठेवतो, तसेच list मध्ये अनेक values ठेवता येतात. List square brackets मध्ये लिहतात आणि items ला comma ने वेगळे करतात. List मधील प्रत्येक item ला एक number असतो ज्याला index म्हणतात. Index नेहमी 0 पासून सुरू होतो. म्हणजे पहिला item index 0 वर आहे, दुसरा index 1 वर. len() function ने list मध्ये किती items आहेत हे कळते. append() ने नवीन item add करता येतो. remove() ने item हटवता येतो. List मधील कोणताही item बदलता येतो. Lists हे Python मधील सर्वात उपयुक्त data structure आहे.", example: 'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])\nprint(fruits[1])\nprint(len(fruits))\nfruits.append("orange")\nprint(fruits)\nfruits.remove("banana")\nprint(fruits)' },
  { id: 10, title: "Functions", content: "Function हा एक छोटा program असतो जो एक specific काम करतो. Function चा सर्वात मोठा फायदा म्हणजे एकदा लिहा आणि अनेक वेळा वापरा. जसे TV चा remote एक function आहे — तो एकदा बनवला आणि अनेक वेळा वापरतो. def keyword ने function बनवतात. def च्या नंतर function चे नाव लिहतात, मग brackets मध्ये parameters. Parameters म्हणजे त्या values ज्या आपण function ला देतो. Function च्या आत चा code तेव्हा चालतो जेव्हा आपण function ला call करतो. Function call करण्यासाठी function चे नाव आणि brackets लिहतात. return keyword वापरून function एखादे value परत देऊ शकते. Functions मुळे code neat आणि reusable होतो.", example: 'def namaskaar(naam):\n    print("नमस्कार", naam, "जी!")\n\ndef add(a, b):\n    result = a + b\n    return result\n\nnamaskaar("Sharada")\nnamaskaar("Pyra")\nans = add(5, 3)\nprint("5 + 3 =", ans)\nprint("10 + 20 =", add(10, 20))' },
  { id: 11, title: "String Operations", content: "String म्हणजे text. String सोबत आपण खूप काही करू शकतो. दोन strings जोडण्यासाठी plus operator वापरतो. upper() ने सर्व अक्षरे मोठी होतात. lower() ने सर्व अक्षरे लहान होतात. len() ने string मध्ये किती characters आहेत हे कळते. replace() ने एखादा शब्द बदलता येतो. split() ने string चे parts करता येतात. in keyword ने check करता येते की एखादा शब्द string मध्ये आहे की नाही. strip() ने string च्या सुरुवातीचे आणि शेवटचे spaces हटवता येतात. String operations खूप उपयुक्त आहेत कारण real programs मध्ये text सोबत खूप काम करावे लागते. Forms, messages, files — सगळीकडे strings असतात.", example: 'naam = "sharada"\nprint(naam.upper())\nprint(naam.lower())\nprint(len(naam))\nprint("नमस्कार " + naam)\nprint(naam.replace("sharada", "pyra"))\nprint("sha" in naam)\nwords = "apple,banana,mango"\nprint(words.split(","))' },
  { id: 12, title: "Math Operations", content: "Python एक उत्तम calculator देखील आहे. बेरजेसाठी plus, वजाबाकीसाठी minus, गुणाकारासाठी star, भागाकारासाठी slash वापरतो. बाकी म्हणजे remainder साठी percent sign वापरतो. Double star ने power काढता येतो जसे 2 ची power 3 म्हणजे 8. Double slash ने floor division होतो जो भागाकारानंतर decimal हटवतो. Python मध्ये math module देखील असतो ज्याने square root, trigonometry सारख्या calculations करता येतात. import math लिहून हा module वापरता येतो. math.sqrt() ने square root, math.pi ने pi ची value मिळते. Calculator बनवण्यात हेच सर्व operations काम येतात.", example: "a = 10\nb = 3\nprint('बेरीज:', a + b)\nprint('वजाबाकी:', a - b)\nprint('गुणाकार:', a * b)\nprint('भागाकार:', a / b)\nprint('बाकी:', a % b)\nprint('घात:', 2 ** 10)\n\nimport math\nprint('Square root of 16:', math.sqrt(16))" },
  { id: 13, title: "Comments", content: "Comments म्हणजे त्या ओळी ज्या Python run करत नाही. Comments फक्त आपल्या developers साठी असतात — code समजावून सांगण्यासाठी. जसे पुस्तकात notes लिहतो, तसेच code मध्ये comments लिहतो. Hash symbol म्हणजे # ने single line comment बनवतो. # च्या नंतर जे काही लिहाल ते Python ignore करते. Comments लिहणे खूप महत्त्वाचे आहे कारण नंतर जेव्हा आपण आपला code दुबारा वाचू किंवा दुसरा कोणी वाचेल तर समजेल. चांगले programmers नेहमी comments लिहतात. Comments मुळे team work करणे सोपे होते. एक professional programmer म्हणून comments लिहणे ही सवय लावून घ्या.", example: "# हे एक simple calculator आहे\na = 10  # पहिला number\nb = 5   # दुसरा number\n\n# बेरीज करतो\nresult = a + b\nprint('बेरीज:', result)  # result print करा\n\n# हे program Sharada ने लिहिले आहे" },
  { id: 14, title: "Error Handling", content: "जेव्हा Python ला एखादी चूक सापडते तेव्हा program बंद होतो. पण real apps मध्ये आपल्याला program बंद व्हायला नको असतो. यासाठी try आणि except वापरतो. try च्या आत तो code लिहतो ज्यात error येऊ शकते. जर error आली तर except वाला code चालतो आणि program बंद होत नाही. उदाहरणार्थ जर आपण एखाद्या number ला zero ने divide केले तर error येते. try आणि except ने ती error पकडून user ला एक चांगला message देऊ शकतो. ZeroDivisionError म्हणजे zero ने divide केल्याची error. ValueError म्हणजे चुकीच्या type ची value दिली तेव्हा येणारी error. finally block नेहमी चालतो मग error असो किंवा नसो. हे professional programming चा खूप महत्त्वाचा भाग आहे.", example: "try:\n    result = 10 / 0\n    print(result)\nexcept ZeroDivisionError:\n    print('चूक! शून्याने भाग होत नाही')\n\ntry:\n    number = int('hello')\nexcept ValueError:\n    print('चूक! हे number नाही')\nfinally:\n    print('Program चालू आहे')" },
  { id: 15, title: "Mini Project — Calculator", content: "शाब्बास! तुम्ही Python चे सर्व basic concepts शिकलात. आता आपण हे सर्व एकत्र करून एक real calculator बनवूया. या calculator मध्ये आपण functions वापरू, if/else conditions वापरू, आणि variables वापरू. हे तुमचे पहिले Python project आहे. हे बनवल्यावर तुम्ही म्हणू शकता की मी Python मध्ये एक program बनवला आहे. हा calculator दोन numbers घेतो, operation विचारतो, आणि result देतो. या project मध्ये आपण शिकलेल्या सर्व गोष्टी एकत्र आल्या आहेत — variables, functions, if/elif/else, आणि return. पुढे जाऊन तुम्ही हा calculator आणखी चांगला बनवू शकता जसे की history ठेवणे किंवा square root add करणे.", example: 'def calculator(a, b, operation):\n    if operation == "+":\n        return a + b\n    elif operation == "-":\n        return a - b\n    elif operation == "*":\n        return a * b\n    elif operation == "/":\n        if b != 0:\n            return a / b\n        else:\n            return "शून्याने भाग होत नाही"\n    else:\n        return "चुकीचे operation"\n\nprint(calculator(10, 5, "+"))\nprint(calculator(10, 5, "-"))\nprint(calculator(10, 5, "*"))\nprint(calculator(10, 5, "/"))' },
]



// ✅ REPLACE your existing sqlLessons and sqlLessonsEnglish with these
// ✅ Also paste sqlLessonsMarathi as a new array
// ✅ Paste all 3 arrays BEFORE `const javascriptLessons` in LessonsPage.jsx

// ─────────────────────────────────────────
// SQL LESSONS — HINDI
// ─────────────────────────────────────────
const sqlLessons = [
  {
    id: 1,
    title: "SQL क्या है?",
    content: "SQL का पूरा नाम है Structured Query Language। SQL एक special language है जिससे हम database के साथ बात करते हैं। Database एक जगह है जहाँ बहुत सारा data store होता है। जैसे school में एक register होता है जिसमें सभी students के नाम, उम्र, और marks लिखे होते हैं — वैसे ही computer में database होता है। SQL से हम उस database से data निकाल सकते हैं, नया data डाल सकते हैं, पुराना data बदल सकते हैं, और data हटा सकते हैं। SQL 1970 के दशक में बनाई गई थी और आज भी दुनिया की हर बड़ी company इसे use करती है। हर app जैसे WhatsApp, Instagram, और Amazon के पीछे एक database होता है और उसे SQL से manage किया जाता है। SQL सीखना हर programmer के लिए बहुत जरूरी है।",
    example: null
  },
  {
    id: 2,
    title: "SELECT Statement",
    content: "SELECT statement SQL का सबसे जरूरी और सबसे ज्यादा use होने वाला command है। SELECT का मतलब है — database की table से data निकालना या देखना। जैसे हम library में जाकर कहते हैं मुझे सभी किताबें दिखाओ, वैसे ही SELECT से हम table का सारा data देख सकते हैं। Star symbol यानी asterisk का मतलब है सभी columns। FROM के बाद table का नाम लिखते हैं। अगर हमें सिर्फ कुछ specific columns चाहिए तो star की जगह column के नाम लिखते हैं। SELECT एक non-destructive command है यानी इससे data सिर्फ दिखता है, बदलता या हटता नहीं। यह सबसे safe command है।",
    example: "-- सभी data देखें\nSELECT * FROM students;\n\n-- सिर्फ नाम और उम्र देखें\nSELECT name, age FROM students;\n\n-- सिर्फ नाम देखें\nSELECT name FROM students;"
  },
  {
    id: 3,
    title: "WHERE Clause",
    content: "WHERE clause से हम condition लगाकर specific data निकालते हैं। जैसे अगर हमें सिर्फ 18 साल से बड़े students चाहिए, तो WHERE से वो filter कर सकते हैं। WHERE हमेशा SELECT के बाद और table के नाम के बाद लिखते हैं। WHERE में हम greater than, less than, equal to, not equal to जैसे operators use करते हैं। Text values को quotes के अंदर लिखते हैं। WHERE में AND और OR से एक साथ कई conditions लगा सकते हैं। AND का मतलब है दोनों conditions सच हों। OR का मतलब है कोई एक condition सच हो। WHERE clause बहुत powerful है और real projects में हर query में use होता है।",
    example: "-- उम्र 18 से ज्यादा वाले students\nSELECT * FROM students\nWHERE age > 18;\n\n-- Mumbai के students\nSELECT * FROM students\nWHERE city = 'Mumbai';\n\n-- Mumbai के 18+ students\nSELECT * FROM students\nWHERE city = 'Mumbai' AND age > 18;"
  },
  {
    id: 4,
    title: "INSERT Statement",
    content: "INSERT statement से हम database की table में नया data डालते हैं। जैसे school register में नए student का नाम लिखते हैं, वैसे ही INSERT से नया record add करते हैं। INSERT INTO के बाद table का नाम लिखते हैं। फिर brackets में वो columns लिखते हैं जिनमें data डालना है। VALUES के बाद brackets में actual values लिखते हैं। Columns और values का order एक जैसा होना चाहिए। Text values को single quotes में लिखते हैं। Numbers को quotes की जरूरत नहीं। एक बार में एक या एक साथ कई records insert किए जा सकते हैं। INSERT करने के बाद वो data permanently table में save हो जाता है।",
    example: "-- एक नया student add करें\nINSERT INTO students (name, age, city)\nVALUES ('Sharada', 20, 'Mumbai');\n\n-- एक साथ कई students add करें\nINSERT INTO students (name, age, city)\nVALUES ('Rahul', 22, 'Delhi'),\n       ('Priya', 19, 'Pune'),\n       ('Amit', 21, 'Chennai');"
  },
  {
    id: 5,
    title: "UPDATE Statement",
    content: "UPDATE statement से हम table में पहले से मौजूद data को बदलते हैं। जैसे किसी student का address बदल गया, तो हम उसे update करते हैं। UPDATE के बाद table का नाम लिखते हैं। SET के बाद column का नाम और नई value लिखते हैं। WHERE clause लगाना बहुत जरूरी है — अगर WHERE नहीं लगाया तो table के सभी rows update हो जाएंगे जो बहुत बड़ी गलती है। WHERE से हम specify करते हैं कि कौन सी row update होनी चाहिए। SET में comma से multiple columns एक साथ update किए जा सकते हैं। UPDATE एक destructive operation है इसलिए हमेशा सोच-समझकर use करें।",
    example: "-- Sharada की उम्र update करें\nUPDATE students\nSET age = 21\nWHERE name = 'Sharada';\n\n-- एक साथ दो चीज़ें update करें\nUPDATE students\nSET age = 21, city = 'Pune'\nWHERE name = 'Sharada';"
  },
  {
    id: 6,
    title: "DELETE Statement",
    content: "DELETE statement से हम table से data हटाते हैं। जैसे school register से किसी student का नाम काटते हैं, वैसे ही DELETE से record हटाते हैं। DELETE FROM के बाद table का नाम लिखते हैं। UPDATE की तरह यहाँ भी WHERE clause लगाना बहुत जरूरी है। अगर WHERE नहीं लगाया तो table के सभी records delete हो जाएंगे — यह बहुत बड़ी गलती है और data वापस नहीं आएगा। WHERE से हम specify करते हैं कि कौन सा record delete होना चाहिए। DELETE करने से पहले हमेशा एक बार SELECT करके देख लो कि कौन सा data delete होगा। DELETE permanent है — एक बार delete हुआ data वापस नहीं आता।",
    example: "-- पहले check करो कि क्या delete होगा\nSELECT * FROM students\nWHERE name = 'Sharada';\n\n-- फिर delete करो\nDELETE FROM students\nWHERE name = 'Sharada';\n\n-- सभी records delete (खतरनाक!)\n-- DELETE FROM students;"
  },
  {
    id: 7,
    title: "CREATE TABLE",
    content: "CREATE TABLE से हम database में नई table बनाते हैं। Table एक spreadsheet की तरह होती है जिसमें rows और columns होते हैं। CREATE TABLE के बाद table का नाम लिखते हैं। फिर brackets के अंदर सभी columns के नाम और उनके data types लिखते हैं। INT का मतलब पूरी संख्या। VARCHAR का मतलब text और brackets में maximum length लिखते हैं। DATE का मतलब तारीख। PRIMARY KEY वो column होता है जो हर row को unique identify करता है जैसे id। NOT NULL का मतलब है कि यह column खाली नहीं रह सकता। Table बनाने के बाद उसमें INSERT से data डाल सकते हैं।",
    example: "CREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL,\n  age INT,\n  city VARCHAR(50),\n  marks FLOAT\n);\n\n-- Table देखें\nSELECT * FROM students;"
  },
  {
    id: 8,
    title: "ORDER BY",
    content: "ORDER BY से हम query के result को sort करते हैं। जैसे हम students को उनके marks के हिसाब से ऊपर से नीचे लगाना चाहते हैं, वो ORDER BY से होता है। ORDER BY हमेशा query के अंत में लिखते हैं। ASC का मतलब है ascending order यानी छोटे से बड़े की तरफ। DESC का मतलब है descending order यानी बड़े से छोटे की तरफ। Default ORDER BY ASC होता है। एक से ज्यादा columns से भी sort कर सकते हैं — पहले एक column से फिर दूसरे से। ORDER BY text columns पर भी काम करता है — alphabetically sort होता है।",
    example: "-- उम्र के हिसाब से छोटे से बड़े\nSELECT * FROM students\nORDER BY age ASC;\n\n-- marks के हिसाब से बड़े से छोटे\nSELECT * FROM students\nORDER BY marks DESC;\n\n-- नाम alphabetically\nSELECT * FROM students\nORDER BY name ASC;"
  },
  {
    id: 9,
    title: "COUNT, SUM, AVG Functions",
    content: "SQL में कुछ special functions होते हैं जिन्हें Aggregate Functions कहते हैं। ये functions पूरी table पर काम करते हैं और एक result देते हैं। COUNT() से rows की संख्या निकालते हैं। SUM() से किसी column के सभी numbers का जोड़ निकालते हैं। AVG() से average निकालते हैं। MAX() से सबसे बड़ी value निकालते हैं। MIN() से सबसे छोटी value निकालते हैं। ये functions WHERE के साथ भी use हो सकते हैं। जैसे सिर्फ Mumbai के students की average age निकालनी हो। AS keyword से result को एक नाम दे सकते हैं जिसे alias कहते हैं।",
    example: "-- कुल कितने students हैं\nSELECT COUNT(*) AS total_students\nFROM students;\n\n-- सभी की average age\nSELECT AVG(age) AS average_age\nFROM students;\n\n-- सबसे ज्यादा marks\nSELECT MAX(marks) AS highest_marks\nFROM students;"
  },
  {
    id: 10,
    title: "JOIN — दो Tables जोड़ना",
    content: "JOIN से हम दो या उससे ज्यादा tables का data एक साथ निकालते हैं। Real databases में data अलग-अलग tables में रखा जाता है। जैसे एक table में students की जानकारी और दूसरी table में उनके marks। JOIN से हम दोनों tables को जोड़कर एक साथ देख सकते हैं। INNER JOIN सबसे common join है — यह दोनों tables में matching records दिखाता है। JOIN करने के लिए दोनों tables में एक common column होना चाहिए जैसे student_id। ON keyword के बाद वो common column लिखते हैं। JOIN एक बहुत powerful feature है जो real projects में हर जगह use होता है।",
    example: "-- students और marks tables join करें\nSELECT students.name, students.city, marks.score\nFROM students\nINNER JOIN marks\nON students.id = marks.student_id;\n\n-- WHERE के साथ join\nSELECT students.name, marks.score\nFROM students\nINNER JOIN marks ON students.id = marks.student_id\nWHERE marks.score > 80;"
  },
]

// ─────────────────────────────────────────
// SQL LESSONS — ENGLISH
// ─────────────────────────────────────────
const sqlLessonsEnglish = [
  {
    id: 1,
    title: "What is SQL?",
    content: "SQL stands for Structured Query Language. SQL is a special language that we use to communicate with a database. A database is a place where a large amount of data is stored. Think of it like a school register that contains the names, ages, and marks of all students — a database is like that but stored on a computer. Using SQL we can retrieve data from a database, insert new data, update existing data, and delete data. SQL was created in the 1970s and even today every major company in the world uses it. Every app like WhatsApp, Instagram, and Amazon has a database behind it and SQL is used to manage that database. Learning SQL is essential for every programmer.",
    example: null
  },
  {
    id: 2,
    title: "SELECT Statement",
    content: "The SELECT statement is the most important and most frequently used command in SQL. SELECT means retrieving or viewing data from a table in the database. Just like going to a library and saying show me all the books, SELECT lets us see all the data in a table. The star symbol also called asterisk means all columns. After FROM we write the name of the table. If we only need specific columns we write the column names instead of the star. SELECT is a non-destructive command which means it only shows the data without changing or deleting anything. It is the safest SQL command to use.",
    example: "-- View all data\nSELECT * FROM students;\n\n-- View only name and age\nSELECT name, age FROM students;\n\n-- View only names\nSELECT name FROM students;"
  },
  {
    id: 3,
    title: "WHERE Clause",
    content: "The WHERE clause lets us filter data by applying a condition. For example if we only want students who are older than 18 we can filter them using WHERE. WHERE is always written after SELECT and after the table name. In WHERE we use operators like greater than, less than, equal to, and not equal to. Text values are written inside single quotes. We can apply multiple conditions at once using AND and OR with WHERE. AND means both conditions must be true. OR means at least one condition must be true. The WHERE clause is very powerful and is used in almost every query in real projects.",
    example: "-- Students older than 18\nSELECT * FROM students\nWHERE age > 18;\n\n-- Students from Mumbai\nSELECT * FROM students\nWHERE city = 'Mumbai';\n\n-- Students from Mumbai AND older than 18\nSELECT * FROM students\nWHERE city = 'Mumbai' AND age > 18;"
  },
  {
    id: 4,
    title: "INSERT Statement",
    content: "The INSERT statement is used to add new data into a table in the database. Just like writing a new student's name in a school register, INSERT adds a new record to the table. After INSERT INTO we write the table name. Then inside brackets we write the column names where we want to insert data. After VALUES we write the actual values inside brackets. The order of columns and values must match. Text values are written inside single quotes. Numbers do not need quotes. We can insert one record or multiple records at once. Once inserted the data is permanently saved in the table.",
    example: "-- Add one new student\nINSERT INTO students (name, age, city)\nVALUES ('Sharada', 20, 'Mumbai');\n\n-- Add multiple students at once\nINSERT INTO students (name, age, city)\nVALUES ('Rahul', 22, 'Delhi'),\n       ('Priya', 19, 'Pune'),\n       ('Amit', 21, 'Chennai');"
  },
  {
    id: 5,
    title: "UPDATE Statement",
    content: "The UPDATE statement is used to change existing data in a table. For example if a student's address has changed we update it using UPDATE. After UPDATE we write the table name. After SET we write the column name and the new value. Using the WHERE clause is very important here — if we do not use WHERE then all rows in the table will be updated which is a very serious mistake. WHERE tells SQL which specific row should be updated. We can update multiple columns at once by separating them with commas in the SET clause. UPDATE is a destructive operation so always use it carefully.",
    example: "-- Update Sharada's age\nUPDATE students\nSET age = 21\nWHERE name = 'Sharada';\n\n-- Update two things at once\nUPDATE students\nSET age = 21, city = 'Pune'\nWHERE name = 'Sharada';"
  },
  {
    id: 6,
    title: "DELETE Statement",
    content: "The DELETE statement is used to remove data from a table. Just like crossing out a student's name from a school register, DELETE removes a record. After DELETE FROM we write the table name. Just like UPDATE the WHERE clause is extremely important here. If we do not use WHERE then all records in the table will be deleted — this is a very serious mistake and the data cannot be recovered. WHERE tells SQL exactly which record should be deleted. Before running DELETE always run a SELECT first to verify which data will be deleted. DELETE is permanent — once deleted the data cannot be recovered.",
    example: "-- First check what will be deleted\nSELECT * FROM students\nWHERE name = 'Sharada';\n\n-- Then delete\nDELETE FROM students\nWHERE name = 'Sharada';\n\n-- Delete all records (DANGEROUS!)\n-- DELETE FROM students;"
  },
  {
    id: 7,
    title: "CREATE TABLE",
    content: "CREATE TABLE is used to create a new table in the database. A table is like a spreadsheet with rows and columns. After CREATE TABLE we write the table name. Then inside brackets we write all the column names and their data types. INT means a whole number. VARCHAR means text and we write the maximum length inside brackets. DATE means a date value. PRIMARY KEY is the column that uniquely identifies each row such as an id column. NOT NULL means that column cannot be left empty. After creating the table we can use INSERT to add data into it.",
    example: "CREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL,\n  age INT,\n  city VARCHAR(50),\n  marks FLOAT\n);\n\n-- View the table\nSELECT * FROM students;"
  },
  {
    id: 8,
    title: "ORDER BY",
    content: "ORDER BY is used to sort the results of a query. For example if we want to arrange students from highest to lowest marks we use ORDER BY. ORDER BY is always written at the end of a query. ASC means ascending order which goes from smallest to largest. DESC means descending order which goes from largest to smallest. The default order of ORDER BY is ASC. We can sort by more than one column — first by one column and then by another. ORDER BY also works on text columns and sorts them alphabetically.",
    example: "-- Sort by age from youngest to oldest\nSELECT * FROM students\nORDER BY age ASC;\n\n-- Sort by marks from highest to lowest\nSELECT * FROM students\nORDER BY marks DESC;\n\n-- Sort by name alphabetically\nSELECT * FROM students\nORDER BY name ASC;"
  },
  {
    id: 9,
    title: "COUNT, SUM, AVG Functions",
    content: "SQL has special functions called Aggregate Functions. These functions work on an entire table and return a single result. COUNT() counts the number of rows. SUM() adds up all the numbers in a column. AVG() calculates the average value. MAX() finds the largest value. MIN() finds the smallest value. These functions can also be used together with WHERE to filter before calculating. For example finding the average age of only students from Mumbai. The AS keyword gives a name to the result which is called an alias. Aggregate functions are used in almost every real-world database application.",
    example: "-- Total number of students\nSELECT COUNT(*) AS total_students\nFROM students;\n\n-- Average age of all students\nSELECT AVG(age) AS average_age\nFROM students;\n\n-- Highest marks in the class\nSELECT MAX(marks) AS highest_marks\nFROM students;"
  },
  {
    id: 10,
    title: "JOIN — Combining Two Tables",
    content: "JOIN is used to retrieve data from two or more tables at the same time. In real databases data is kept in separate tables. For example one table has student information and another table has their marks. JOIN lets us combine both tables and view the data together. INNER JOIN is the most common type of join — it shows only the records that have a match in both tables. To use JOIN both tables must have a common column such as student_id. After the ON keyword we write that common column. JOIN is a very powerful feature that is used everywhere in real projects.",
    example: "-- Join students and marks tables\nSELECT students.name, students.city, marks.score\nFROM students\nINNER JOIN marks\nON students.id = marks.student_id;\n\n-- Join with WHERE filter\nSELECT students.name, marks.score\nFROM students\nINNER JOIN marks ON students.id = marks.student_id\nWHERE marks.score > 80;"
  },
]

// ─────────────────────────────────────────
// SQL LESSONS — MARATHI (NEW)
// ─────────────────────────────────────────
const sqlLessonsMarathi = [
  {
    id: 1,
    title: "SQL म्हणजे काय?",
    content: "SQL चे पूर्ण नाव आहे Structured Query Language. SQL ही एक special language आहे ज्याने आपण database शी बोलतो. Database म्हणजे एक जागा जिथे खूप सारा data store होतो. जसे शाळेत एक register असते ज्यात सर्व students चे नाव, वय, आणि marks लिहिलेले असतात — तसेच computer मध्ये database असतो. SQL ने आपण त्या database मधून data काढू शकतो, नवीन data टाकू शकतो, जुना data बदलू शकतो, आणि data हटवू शकतो. SQL 1970 च्या दशकात बनवली गेली होती आणि आजही जगातील प्रत्येक मोठी company ती वापरते. WhatsApp, Instagram, आणि Amazon सारख्या प्रत्येक app च्या मागे एक database असतो आणि त्याला SQL ने manage केले जाते. SQL शिकणे प्रत्येक programmer साठी खूप आवश्यक आहे.",
    example: null
  },
  {
    id: 2,
    title: "SELECT Statement",
    content: "SELECT statement हे SQL मधील सर्वात महत्त्वाचे आणि सर्वाधिक वापरले जाणारे command आहे. SELECT चा अर्थ आहे — database च्या table मधून data काढणे किंवा पाहणे. जसे आपण library मध्ये जाऊन म्हणतो मला सर्व पुस्तके दाखवा, तसेच SELECT ने आपण table चा सर्व data पाहू शकतो. Star symbol म्हणजे asterisk चा अर्थ आहे सर्व columns. FROM च्या नंतर table चे नाव लिहतो. जर आपल्याला फक्त काही specific columns हवे असतील तर star च्या जागी column चे नाव लिहतो. SELECT हे non-destructive command आहे म्हणजे यातून data फक्त दिसतो, बदलत किंवा हटत नाही. हे सर्वात safe command आहे.",
    example: "-- सर्व data पाहा\nSELECT * FROM students;\n\n-- फक्त नाव आणि वय पाहा\nSELECT name, age FROM students;\n\n-- फक्त नावे पाहा\nSELECT name FROM students;"
  },
  {
    id: 3,
    title: "WHERE Clause",
    content: "WHERE clause ने आपण condition लावून specific data काढतो. उदाहरणार्थ जर आपल्याला फक्त 18 वर्षांपेक्षा मोठे students हवे असतील तर WHERE ने ते filter करता येतात. WHERE नेहमी SELECT च्या नंतर आणि table च्या नावाच्या नंतर लिहतो. WHERE मध्ये आपण greater than, less than, equal to, not equal to असे operators वापरतो. Text values single quotes मध्ये लिहतो. WHERE सोबत AND आणि OR वापरून एकत्र अनेक conditions लावता येतात. AND चा अर्थ आहे दोन्ही conditions बरोबर असाव्यात. OR चा अर्थ आहे कोणतीही एक condition बरोबर असावी. WHERE clause खूप powerful आहे आणि real projects मध्ये प्रत्येक query मध्ये वापरले जाते.",
    example: "-- 18 पेक्षा मोठे students\nSELECT * FROM students\nWHERE age > 18;\n\n-- Pune चे students\nSELECT * FROM students\nWHERE city = 'Pune';\n\n-- Pune चे आणि 18+ students\nSELECT * FROM students\nWHERE city = 'Pune' AND age > 18;"
  },
  {
    id: 4,
    title: "INSERT Statement",
    content: "INSERT statement ने आपण database च्या table मध्ये नवीन data टाकतो. जसे शाळेच्या register मध्ये नव्या student चे नाव लिहतो, तसेच INSERT ने नवीन record add करतो. INSERT INTO च्या नंतर table चे नाव लिहतो. मग brackets मध्ये ते columns लिहतो ज्यात data टाकायचा आहे. VALUES च्या नंतर brackets मध्ये actual values लिहतो. Columns आणि values चा order एकसारखा असायला हवा. Text values single quotes मध्ये लिहतो. Numbers ला quotes ची गरज नाही. एकावेळी एक किंवा एकत्र अनेक records insert करता येतात. INSERT केल्यानंतर तो data permanently table मध्ये save होतो.",
    example: "-- एक नवीन student add करा\nINSERT INTO students (name, age, city)\nVALUES ('Sharada', 20, 'Pune');\n\n-- एकत्र अनेक students add करा\nINSERT INTO students (name, age, city)\nVALUES ('Rahul', 22, 'Mumbai'),\n       ('Priya', 19, 'Nashik'),\n       ('Amit', 21, 'Nagpur');"
  },
  {
    id: 5,
    title: "UPDATE Statement",
    content: "UPDATE statement ने आपण table मधील आधीच असलेला data बदलतो. उदाहरणार्थ एखाद्या student चा address बदलला, तर आपण तो update करतो. UPDATE च्या नंतर table चे नाव लिहतो. SET च्या नंतर column चे नाव आणि नवीन value लिहतो. WHERE clause लावणे खूप महत्त्वाचे आहे — जर WHERE लावला नाही तर table च्या सर्व rows update होतील जी खूप मोठी चूक आहे. WHERE ने आपण specify करतो की कोणती row update व्हायला हवी. SET मध्ये comma ने multiple columns एकत्र update करता येतात. UPDATE हे destructive operation आहे म्हणून नेहमी विचारपूर्वक वापरा.",
    example: "-- Sharada चे वय update करा\nUPDATE students\nSET age = 21\nWHERE name = 'Sharada';\n\n-- एकत्र दोन गोष्टी update करा\nUPDATE students\nSET age = 21, city = 'Mumbai'\nWHERE name = 'Sharada';"
  },
  {
    id: 6,
    title: "DELETE Statement",
    content: "DELETE statement ने आपण table मधून data हटवतो. जसे शाळेच्या register मधून एखाद्या student चे नाव खोडतो, तसेच DELETE ने record हटवतो. DELETE FROM च्या नंतर table चे नाव लिहतो. UPDATE सारखेच इथेही WHERE clause लावणे अत्यंत आवश्यक आहे. जर WHERE लावला नाही तर table चे सर्व records delete होतील — ही खूप मोठी चूक आहे आणि data परत येणार नाही. WHERE ने आपण specify करतो की कोणता record delete व्हायला हवा. DELETE करण्यापूर्वी नेहमी आधी SELECT करून पाहा की कोणता data delete होणार आहे. DELETE permanent आहे — एकदा delete झालेला data परत येत नाही.",
    example: "-- आधी check करा काय delete होणार\nSELECT * FROM students\nWHERE name = 'Sharada';\n\n-- मग delete करा\nDELETE FROM students\nWHERE name = 'Sharada';\n\n-- सर्व records delete (धोकादायक!)\n-- DELETE FROM students;"
  },
  {
    id: 7,
    title: "CREATE TABLE",
    content: "CREATE TABLE ने आपण database मध्ये नवीन table बनवतो. Table म्हणजे एक spreadsheet सारखी असते ज्यात rows आणि columns असतात. CREATE TABLE च्या नंतर table चे नाव लिहतो. मग brackets च्या आत सर्व columns चे नाव आणि त्यांचे data types लिहतो. INT चा अर्थ पूर्ण संख्या. VARCHAR चा अर्थ text आणि brackets मध्ये maximum length लिहतो. DATE चा अर्थ तारीख. PRIMARY KEY तो column असतो जो प्रत्येक row ला uniquely identify करतो जसे id. NOT NULL चा अर्थ आहे की हा column रिकामा राहू शकत नाही. Table बनवल्यानंतर त्यात INSERT ने data टाकता येतो.",
    example: "CREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL,\n  age INT,\n  city VARCHAR(50),\n  marks FLOAT\n);\n\n-- Table पाहा\nSELECT * FROM students;"
  },
  {
    id: 8,
    title: "ORDER BY",
    content: "ORDER BY ने आपण query च्या result ला sort करतो. उदाहरणार्थ students ना त्यांच्या marks नुसार वरून खाली लावायचे असेल तर ORDER BY वापरतो. ORDER BY नेहमी query च्या शेवटी लिहतो. ASC चा अर्थ आहे ascending order म्हणजे लहानातून मोठ्याकडे. DESC चा अर्थ आहे descending order म्हणजे मोठ्यातून लहानाकडे. Default ORDER BY ASC असतो. एकापेक्षा जास्त columns नुसार देखील sort करता येते. ORDER BY text columns वर देखील काम करतो — alphabetically sort होतो.",
    example: "-- वयानुसार लहानातून मोठ्याकडे\nSELECT * FROM students\nORDER BY age ASC;\n\n-- marks नुसार मोठ्यातून लहानाकडे\nSELECT * FROM students\nORDER BY marks DESC;\n\n-- नावानुसार alphabetically\nSELECT * FROM students\nORDER BY name ASC;"
  },
  {
    id: 9,
    title: "COUNT, SUM, AVG Functions",
    content: "SQL मध्ये काही special functions असतात ज्यांना Aggregate Functions म्हणतात. हे functions संपूर्ण table वर काम करतात आणि एक result देतात. COUNT() ने rows ची संख्या काढतो. SUM() ने एखाद्या column च्या सर्व numbers ची बेरीज काढतो. AVG() ने average काढतो. MAX() ने सर्वात मोठी value काढतो. MIN() ने सर्वात लहान value काढतो. हे functions WHERE सोबत देखील वापरता येतात. उदाहरणार्थ फक्त Pune च्या students ची average age काढायची असेल. AS keyword ने result ला एक नाव देता येते ज्याला alias म्हणतात. Aggregate functions real-world database applications मध्ये सर्वत्र वापरले जातात.",
    example: "-- एकूण किती students आहेत\nSELECT COUNT(*) AS total_students\nFROM students;\n\n-- सर्वांची average age\nSELECT AVG(age) AS average_age\nFROM students;\n\n-- सर्वात जास्त marks\nSELECT MAX(marks) AS highest_marks\nFROM students;"
  },
  {
    id: 10,
    title: "JOIN — दोन Tables जोडणे",
    content: "JOIN ने आपण दोन किंवा अधिक tables चा data एकत्र काढतो. Real databases मध्ये data वेगवेगळ्या tables मध्ये ठेवला जातो. उदाहरणार्थ एका table मध्ये students ची माहिती आणि दुसऱ्या table मध्ये त्यांचे marks. JOIN ने आपण दोन्ही tables जोडून एकत्र पाहू शकतो. INNER JOIN हे सर्वात common join आहे — हे दोन्ही tables मध्ये matching records दाखवते. JOIN वापरण्यासाठी दोन्ही tables मध्ये एक common column असायला हवा जसे student_id. ON keyword च्या नंतर तो common column लिहतो. JOIN हे खूप powerful feature आहे जे real projects मध्ये सर्वत्र वापरले जाते.",
    example: "-- students आणि marks tables join करा\nSELECT students.name, students.city, marks.score\nFROM students\nINNER JOIN marks\nON students.id = marks.student_id;\n\n-- WHERE सोबत join\nSELECT students.name, marks.score\nFROM students\nINNER JOIN marks ON students.id = marks.student_id\nWHERE marks.score > 80;"
  },
]




// ✅ REPLACE your existing javascriptLessons and javascriptLessonsEnglish with these
// ✅ Also paste javascriptLessonsMarathi as a new array
// ✅ Paste all 3 arrays BEFORE the `function LessonsPage()` line in LessonsPage.jsx

// ─────────────────────────────────────────
// JAVASCRIPT LESSONS — HINDI
// ─────────────────────────────────────────
const javascriptLessons = [
  {
    id: 1,
    title: "JavaScript क्या है?",
    content: "JavaScript एक programming language है जो websites को interactive और जीवंत बनाती है। जब आप किसी website पर button click करते हैं और कुछ होता है, menu खुलती है, या कोई animation चलती है — यह सब JavaScript की वजह से होता है। JavaScript को 1995 में Brendan Eich ने बनाया था। JavaScript तीन चीज़ों में से एक है जो हर website बनाने के लिए जरूरी है — HTML structure देता है, CSS design देता है, और JavaScript behavior देता है। JavaScript browser में directly चलती है, कोई extra software install करने की जरूरत नहीं। आज JavaScript सिर्फ browser में नहीं बल्कि server पर भी चलती है। JavaScript दुनिया की सबसे popular programming language है और हर web developer को यह जरूर सीखनी चाहिए।",
    example: null
  },
  {
    id: 2,
    title: "console.log()",
    content: "console.log() JavaScript का सबसे पहला और सबसे जरूरी function है। यह Python के print() जैसा ही है। console.log() browser के developer console में कुछ भी print करता है। Developer console देखने के लिए browser में F12 press करें और Console tab पर जाएं। console.log() में हम text, numbers, variables, और calculations — कुछ भी pass कर सकते हैं। Text को quotes के अंदर लिखते हैं — single या double दोनों चलते हैं। console.log() debugging के लिए बहुत उपयोगी है यानी program में क्या हो रहा है यह check करने के लिए। हर JavaScript developer रोज़ console.log() use करता है।",
    example: 'console.log("नमस्ते दुनिया!");\nconsole.log(42);\nconsole.log("मेरा नाम Pyra है");\nconsole.log(10 + 20);\nconsole.log("2 का square है:", 2 * 2);'
  },
  {
    id: 3,
    title: "Variables — let, const, var",
    content: "JavaScript में variables बनाने के तीन तरीके हैं — let, const, और var. Variable एक डिब्बे की तरह है जिसमें हम data रखते हैं। let से वो variable बनाते हैं जिसकी value बाद में बदल सकती है। जैसे score जो game में बदलता रहता है। const से वो variable बनाते हैं जिसकी value कभी नहीं बदलती। जैसे PI की value हमेशा 3.14159 रहती है। var पुराना तरीका है और आजकल use नहीं करते। Variable का नाम हमेशा letter से शुरू होता है, numbers और underscore भी use हो सकते हैं। JavaScript में variable names case sensitive होते हैं — naam और Naam अलग-अलग हैं। हर statement के अंत में semicolon लगाते हैं।",
    example: 'let naam = "Sharada";\nlet umar = 20;\nconst PI = 3.14159;\n\nconsole.log(naam);\nconsole.log(umar);\n\numar = 21;  // let की value बदल सकती है\nconsole.log(umar);\n\n// PI = 3;  // Error! const नहीं बदलती'
  },
  {
    id: 4,
    title: "Data Types",
    content: "JavaScript में कई data types होते हैं। String मतलब text जो quotes के अंदर लिखते हैं। Number मतलब कोई भी संख्या चाहे पूरी हो या दशमलव। Boolean मतलब true या false। Null मतलब जानबूझकर खाली value। Undefined मतलब variable बनाया पर value नहीं दी। Object मतलब related data का collection। Array मतलब values की list। JavaScript dynamically typed language है यानी एक variable में पहले number रखो फिर string रखो — चलेगा। typeof operator से किसी भी variable का type check कर सकते हैं। Template literals backtick से बनते हैं और उसमें variable directly embed कर सकते हैं।",
    example: 'let naam = "Pyra";          // String\nlet umar = 20;              // Number\nlet marks = 95.5;           // Number (decimal)\nlet isStudent = true;       // Boolean\nlet address = null;         // Null\nlet phone;                  // Undefined\n\nconsole.log(typeof naam);   // string\nconsole.log(typeof umar);   // number\n\n// Template literal\nconsole.log(`मेरा नाम ${naam} है और उम्र ${umar} है`);'
  },
  {
    id: 5,
    title: "If/Else Conditions",
    content: "If/Else JavaScript में decision making के लिए use होता है। Python की तरह ही काम करता है लेकिन syntax थोड़ा अलग है। JavaScript में condition को round brackets के अंदर लिखते हैं और code block को curly braces के अंदर। अगर condition true है तो if block चलता है, नहीं तो else block चलता है। else if से multiple conditions check कर सकते हैं। Comparison operators हैं — equal to के लिए triple equal यानी === लिखते हैं। Triple equal === value और type दोनों check करता है जो better practice है। Double equal == सिर्फ value check करता है। Logical operators AND के लिए double ampersand && और OR के लिए double pipe || लिखते हैं।",
    example: 'let umar = 18;\n\nif (umar >= 18) {\n  console.log("आप vote कर सकते हैं");\n} else {\n  console.log("आप vote नहीं कर सकते");\n}\n\nlet marks = 75;\nif (marks >= 90) {\n  console.log("Grade: A");\n} else if (marks >= 75) {\n  console.log("Grade: B");\n} else if (marks >= 60) {\n  console.log("Grade: C");\n} else {\n  console.log("Grade: F");\n}'
  },
  {
    id: 6,
    title: "For Loop",
    content: "For loop से JavaScript में कोई काम बार बार करवाते हैं। JavaScript का for loop Python से अलग दिखता है लेकिन काम एक जैसा है। For loop में तीन parts होते हैं — initialization जहाँ variable बनाते हैं, condition जो true रहने तक loop चलता है, और update जो हर बार चलता है। तीनों को semicolon से अलग करते हैं। let i = 0 से शुरू करते हैं। i less than 5 तक चलाते हैं। i++ का मतलब है i = i + 1। For loop arrays के साथ भी use होता है। for...of loop से array के हर item पर directly काम कर सकते हैं जो बहुत आसान है।",
    example: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\n// 1 से 10 तक squares\nfor (let i = 1; i <= 10; i++) {\n  console.log(i + " का square है " + (i * i));\n}\n\n// Array के साथ for...of\nlet fruits = ["apple", "banana", "mango"];\nfor (let fruit of fruits) {\n  console.log(fruit);\n}'
  },
  {
    id: 7,
    title: "Functions",
    content: "Functions JavaScript में reusable code blocks होते हैं। एक बार function बनाओ और बार बार use करो। JavaScript में functions बनाने के दो main तरीके हैं। पहला है function declaration जिसमें function keyword लिखते हैं। दूसरा है arrow function जो modern और shorter तरीका है। Function को call करने के लिए उसका नाम और brackets लिखते हैं। Parameters वो values हैं जो हम function को देते हैं। Return keyword से function एक value वापस दे सकता है। Functions से code organized और readable बनता है। Real projects में functions के बिना काम नहीं होता।",
    example: '// Function declaration\nfunction greet(naam) {\n  console.log("नमस्ते " + naam + "!");\n}\n\n// Arrow function\nconst add = (a, b) => {\n  return a + b;\n};\n\n// Short arrow function\nconst multiply = (a, b) => a * b;\n\ngreet("Sharada");\ngreet("Pyra");\nconsole.log(add(5, 3));\nconsole.log(multiply(4, 6));'
  },
  {
    id: 8,
    title: "Arrays",
    content: "Array एक list की तरह है जिसमें हम कई values एक साथ रखते हैं। JavaScript में arrays square brackets में बनाते हैं। Array का index 0 से शुरू होता है। length property से array की size पता चलती है। push() से नया item array के अंत में add होता है। pop() से last item हटता है। forEach() से array के हर item पर एक function चला सकते हैं। map() से array के हर item को transform करके नया array बनता है। filter() से condition के हिसाब से items filter होते हैं। find() से पहला matching item मिलता है। Arrays JavaScript में सबसे ज्यादा use होने वाला data structure है।",
    example: 'let fruits = ["apple", "banana", "mango"];\n\nconsole.log(fruits[0]);       // apple\nconsole.log(fruits.length);   // 3\n\nfruits.push("orange");\nconsole.log(fruits);          // 4 items\n\nfruits.forEach(fruit => {\n  console.log(fruit);\n});\n\nlet numbers = [1, 2, 3, 4, 5];\nlet doubled = numbers.map(n => n * 2);\nconsole.log(doubled);  // [2, 4, 6, 8, 10]'
  },
  {
    id: 9,
    title: "Objects",
    content: "Object में हम related data को एक साथ रखते हैं। जैसे एक student का नाम, उम्र, और marks — ये सब एक student object में रख सकते हैं। Object curly braces में बनता है। अंदर key और value pairs होते हैं। Key और value को colon से अलग करते हैं। अलग-अलग pairs को comma से अलग करते हैं। Object की properties तक पहुँचने के लिए dot notation use करते हैं। Object में functions भी रख सकते हैं जिन्हें methods कहते हैं। Object के अंदर कोई भी data type रख सकते हैं — string, number, array, दूसरा object भी। Real apps में data हमेशा objects की form में होता है।",
    example: 'let student = {\n  naam: "Sharada",\n  umar: 20,\n  sheher: "Mumbai",\n  marks: [85, 90, 78],\n  greet: function() {\n    console.log("नमस्ते, मैं " + this.naam + " हूँ");\n  }\n};\n\nconsole.log(student.naam);\nconsole.log(student.umar);\nconsole.log(student.marks[0]);\nstudent.greet();'
  },
  {
    id: 10,
    title: "DOM Manipulation",
    content: "DOM का मतलब है Document Object Model। DOM से हम JavaScript की मदद से webpage के elements को बदल सकते हैं। जैसे button click करने पर text बदलना, color बदलना, या नया element add करना। getElementById() से किसी element को उसके id से ढूंढते हैं। querySelector() से CSS selector की तरह element ढूंढते हैं। innerHTML से element का content बदलते हैं। style से element की CSS बदलते हैं। addEventListener से button click या keyboard press जैसे events सुनते हैं। DOM manipulation से ही websites interactive बनती हैं। यही JavaScript का सबसे powerful feature है।",
    example: '// HTML में: <h1 id="title">पुराना Title</h1>\n// HTML में: <button id="btn">Click करें</button>\n\n// Title बदलें\ndocument.getElementById("title").innerHTML = "नया Title!";\n\n// Color बदलें\ndocument.getElementById("title").style.color = "blue";\n\n// Button click पर action\ndocument.getElementById("btn").addEventListener("click", function() {\n  alert("Button click हुआ!");\n});'
  },
]

// ─────────────────────────────────────────
// JAVASCRIPT LESSONS — ENGLISH
// ─────────────────────────────────────────
const javascriptLessonsEnglish = [
  {
    id: 1,
    title: "What is JavaScript?",
    content: "JavaScript is a programming language that makes websites interactive and alive. When you click a button on a website and something happens, a menu opens, or an animation plays — all of that is because of JavaScript. JavaScript was created in 1995 by Brendan Eich. JavaScript is one of three things needed to build every website — HTML gives the structure, CSS gives the design, and JavaScript gives the behavior. JavaScript runs directly in the browser so no extra software needs to be installed. Today JavaScript runs not only in browsers but also on servers. JavaScript is the most popular programming language in the world and every web developer must learn it.",
    example: null
  },
  {
    id: 2,
    title: "console.log()",
    content: "console.log() is the first and most important function in JavaScript. It works just like print() in Python. console.log() prints anything to the browser's developer console. To open the developer console press F12 in your browser and go to the Console tab. We can pass text, numbers, variables, and calculations to console.log(). Text is written inside quotes — both single and double quotes work. console.log() is very useful for debugging which means checking what is happening in your program. Every JavaScript developer uses console.log() every single day.",
    example: 'console.log("Hello World!");\nconsole.log(42);\nconsole.log("My name is Pyra");\nconsole.log(10 + 20);\nconsole.log("Square of 2 is:", 2 * 2);'
  },
  {
    id: 3,
    title: "Variables — let, const, var",
    content: "There are three ways to create variables in JavaScript — let, const, and var. A variable is like a box where we store data. We use let for variables whose value can change later. For example a score in a game that keeps changing. We use const for variables whose value never changes. For example the value of PI which is always 3.14159. var is the old way and is no longer used in modern JavaScript. Variable names always start with a letter and can include numbers and underscores. JavaScript variable names are case sensitive — name and Name are different. We put a semicolon at the end of every statement.",
    example: 'let name = "Sharada";\nlet age = 20;\nconst PI = 3.14159;\n\nconsole.log(name);\nconsole.log(age);\n\nage = 21;  // let value can change\nconsole.log(age);\n\n// PI = 3;  // Error! const cannot change'
  },
  {
    id: 4,
    title: "Data Types",
    content: "JavaScript has several data types. String means text written inside quotes. Number means any numeric value whether whole or decimal. Boolean means true or false. Null means an intentionally empty value. Undefined means a variable was created but no value was given. Object means a collection of related data. Array means a list of values. JavaScript is a dynamically typed language which means you can store a number in a variable and later store a string in the same variable. The typeof operator lets us check the type of any variable. Template literals use backticks and allow us to embed variables directly inside a string.",
    example: 'let name = "Pyra";           // String\nlet age = 20;                // Number\nlet marks = 95.5;            // Number (decimal)\nlet isStudent = true;        // Boolean\nlet address = null;          // Null\nlet phone;                   // Undefined\n\nconsole.log(typeof name);    // string\nconsole.log(typeof age);     // number\n\n// Template literal\nconsole.log(`My name is ${name} and I am ${age} years old`);'
  },
  {
    id: 5,
    title: "If/Else Conditions",
    content: "If and Else are used for decision making in JavaScript. They work the same way as in Python but the syntax is a little different. In JavaScript the condition is written inside round brackets and the code block is written inside curly braces. If the condition is true the if block runs, otherwise the else block runs. We use else if to check multiple conditions. For comparison the triple equals operator === is used to check if two values are equal. Triple equals checks both value and type which is the better practice. Double equals == checks only value. The logical AND operator is written as double ampersand and OR is written as double pipe.",
    example: 'let age = 18;\n\nif (age >= 18) {\n  console.log("You can vote");\n} else {\n  console.log("You cannot vote");\n}\n\nlet marks = 75;\nif (marks >= 90) {\n  console.log("Grade: A");\n} else if (marks >= 75) {\n  console.log("Grade: B");\n} else if (marks >= 60) {\n  console.log("Grade: C");\n} else {\n  console.log("Grade: F");\n}'
  },
  {
    id: 6,
    title: "For Loop",
    content: "A for loop is used to repeat a task multiple times in JavaScript. The JavaScript for loop looks different from Python but works the same way. A for loop has three parts — initialization where we create a variable, a condition that keeps the loop running while true, and an update that runs after every iteration. All three parts are separated by semicolons. We start with let i = 0. We run until i is less than 5. The expression i++ means i = i + 1. For loops also work with arrays. The for...of loop lets us work directly with each item in an array which is very easy to use.",
    example: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\n// Squares from 1 to 10\nfor (let i = 1; i <= 10; i++) {\n  console.log(i + " squared is " + (i * i));\n}\n\n// for...of with array\nlet fruits = ["apple", "banana", "mango"];\nfor (let fruit of fruits) {\n  console.log(fruit);\n}'
  },
  {
    id: 7,
    title: "Functions",
    content: "Functions are reusable code blocks in JavaScript. Write a function once and use it as many times as you want. There are two main ways to create functions in JavaScript. The first is a function declaration where we write the function keyword. The second is an arrow function which is the modern and shorter way. To call a function we write its name and brackets. Parameters are the values we pass to a function. The return keyword lets a function send back a value. Functions make code organized and readable. In real projects nothing works without functions.",
    example: '// Function declaration\nfunction greet(name) {\n  console.log("Hello " + name + "!");\n}\n\n// Arrow function\nconst add = (a, b) => {\n  return a + b;\n};\n\n// Short arrow function\nconst multiply = (a, b) => a * b;\n\ngreet("Sharada");\ngreet("Pyra");\nconsole.log(add(5, 3));\nconsole.log(multiply(4, 6));'
  },
  {
    id: 8,
    title: "Arrays",
    content: "An array is like a list where we store many values together. Arrays in JavaScript are created using square brackets. The index of an array starts from 0. The length property tells us the size of the array. push() adds a new item to the end of the array. pop() removes the last item. forEach() runs a function on every item in the array. map() transforms every item in the array and returns a new array. filter() filters items based on a condition. find() returns the first matching item. Arrays are the most frequently used data structure in JavaScript.",
    example: 'let fruits = ["apple", "banana", "mango"];\n\nconsole.log(fruits[0]);       // apple\nconsole.log(fruits.length);   // 3\n\nfruits.push("orange");\nconsole.log(fruits);          // 4 items\n\nfruits.forEach(fruit => {\n  console.log(fruit);\n});\n\nlet numbers = [1, 2, 3, 4, 5];\nlet doubled = numbers.map(n => n * 2);\nconsole.log(doubled);  // [2, 4, 6, 8, 10]'
  },
  {
    id: 9,
    title: "Objects",
    content: "Objects are used to store related data together. For example a student's name, age, and marks can all be stored in one student object. An object is created using curly braces. Inside it we have key and value pairs. The key and value are separated by a colon. Different pairs are separated by commas. We use dot notation to access the properties of an object. Objects can also store functions inside them which are called methods. Any data type can be stored inside an object — strings, numbers, arrays, and even other objects. In real apps data is almost always in the form of objects.",
    example: 'let student = {\n  name: "Sharada",\n  age: 20,\n  city: "Mumbai",\n  marks: [85, 90, 78],\n  greet: function() {\n    console.log("Hello, I am " + this.name);\n  }\n};\n\nconsole.log(student.name);\nconsole.log(student.age);\nconsole.log(student.marks[0]);\nstudent.greet();'
  },
  {
    id: 10,
    title: "DOM Manipulation",
    content: "DOM stands for Document Object Model. Using the DOM we can change webpage elements with JavaScript. For example changing text when a button is clicked, changing a color, or adding a new element. getElementById() finds an element by its id. querySelector() finds an element using a CSS selector. innerHTML changes the content of an element. style changes the CSS of an element. addEventListener listens for events like button clicks or keyboard presses. DOM manipulation is what makes websites interactive. This is the most powerful feature of JavaScript.",
    example: '// In HTML: <h1 id="title">Old Title</h1>\n// In HTML: <button id="btn">Click Me</button>\n\n// Change the title\ndocument.getElementById("title").innerHTML = "New Title!";\n\n// Change the color\ndocument.getElementById("title").style.color = "blue";\n\n// Action on button click\ndocument.getElementById("btn").addEventListener("click", function() {\n  alert("Button was clicked!");\n});'
  },
]

// ─────────────────────────────────────────
// JAVASCRIPT LESSONS — MARATHI (NEW)
// ─────────────────────────────────────────
const javascriptLessonsMarathi = [
  {
    id: 1,
    title: "JavaScript म्हणजे काय?",
    content: "JavaScript ही एक programming language आहे जी websites ला interactive आणि जिवंत बनवते. जेव्हा तुम्ही एखाद्या website वर button click करता आणि काहीतरी होते, menu उघडते, किंवा animation चालते — हे सर्व JavaScript मुळे होते. JavaScript 1995 साली Brendan Eich ने बनवली. JavaScript ही तीन गोष्टींपैकी एक आहे जी प्रत्येक website बनवण्यासाठी आवश्यक आहे — HTML structure देते, CSS design देते, आणि JavaScript behavior देते. JavaScript browser मध्ये directly चालते, कोणताही extra software install करण्याची गरज नाही. आज JavaScript फक्त browser मध्ये नाही तर server वर देखील चालते. JavaScript ही जगातील सर्वात popular programming language आहे आणि प्रत्येक web developer ला ती शिकणे आवश्यक आहे.",
    example: null
  },
  {
    id: 2,
    title: "console.log()",
    content: "console.log() हे JavaScript मधील सर्वात पहिले आणि सर्वात महत्त्वाचे function आहे. हे Python च्या print() सारखेच आहे. console.log() browser च्या developer console मध्ये काहीही print करते. Developer console पाहण्यासाठी browser मध्ये F12 press करा आणि Console tab वर जा. console.log() मध्ये आपण text, numbers, variables, आणि calculations — काहीही pass करू शकतो. Text quotes च्या आत लिहतो — single किंवा double दोन्ही चालतात. console.log() debugging साठी खूप उपयुक्त आहे म्हणजे program मध्ये काय होत आहे हे check करण्यासाठी. प्रत्येक JavaScript developer रोज console.log() वापरतो.",
    example: 'console.log("नमस्कार जग!");\nconsole.log(42);\nconsole.log("माझे नाव Pyra आहे");\nconsole.log(10 + 20);\nconsole.log("2 चा square आहे:", 2 * 2);'
  },
  {
    id: 3,
    title: "Variables — let, const, var",
    content: "JavaScript मध्ये variables बनवण्याचे तीन मार्ग आहेत — let, const, आणि var. Variable म्हणजे एक डबा जिथे आपण data ठेवतो. let ने असे variable बनवतो ज्याची value नंतर बदलू शकते. जसे game मधील score जो बदलत राहतो. const ने असे variable बनवतो ज्याची value कधीही बदलत नाही. जसे PI ची value नेहमी 3.14159 असते. var हा जुना मार्ग आहे आणि आजकाल वापरत नाही. Variable चे नाव नेहमी letter ने सुरू होते, numbers आणि underscore देखील वापरता येतात. JavaScript मध्ये variable names case sensitive असतात — naam आणि Naam वेगळे आहेत. प्रत्येक statement च्या शेवटी semicolon लावतो.",
    example: 'let naam = "Sharada";\nlet vay = 20;\nconst PI = 3.14159;\n\nconsole.log(naam);\nconsole.log(vay);\n\nvay = 21;  // let ची value बदलू शकते\nconsole.log(vay);\n\n// PI = 3;  // Error! const बदलत नाही'
  },
  {
    id: 4,
    title: "Data Types",
    content: "JavaScript मध्ये अनेक data types आहेत. String म्हणजे text जे quotes च्या आत लिहतो. Number म्हणजे कोणतीही संख्या मग ती पूर्ण असो किंवा दशांश. Boolean म्हणजे true किंवा false. Null म्हणजे जाणूनबुजून रिकामी value. Undefined म्हणजे variable बनवला पण value दिली नाही. Object म्हणजे related data चा collection. Array म्हणजे values ची list. JavaScript ही dynamically typed language आहे म्हणजे एका variable मध्ये आधी number ठेवा नंतर string ठेवा — चालेल. typeof operator ने कोणत्याही variable चा type check करता येतो. Template literals backtick ने बनतात आणि त्यात variable directly embed करता येतो.",
    example: 'let naam = "Pyra";           // String\nlet vay = 20;                // Number\nlet marks = 95.5;            // Number (decimal)\nlet isStudent = true;        // Boolean\nlet address = null;          // Null\nlet phone;                   // Undefined\n\nconsole.log(typeof naam);    // string\nconsole.log(typeof vay);     // number\n\n// Template literal\nconsole.log(`माझे नाव ${naam} आहे आणि वय ${vay} आहे`);'
  },
  {
    id: 5,
    title: "If/Else Conditions",
    content: "If आणि Else JavaScript मध्ये निर्णय घेण्यासाठी वापरतात. Python सारखेच काम करते पण syntax थोडे वेगळे आहे. JavaScript मध्ये condition round brackets च्या आत लिहतो आणि code block curly braces च्या आत लिहतो. जर condition true असेल तर if block चालतो, नाहीतर else block चालतो. else if ने multiple conditions check करता येतात. Comparison साठी triple equals operator === वापरतो. Triple equals value आणि type दोन्ही check करतो जे better practice आहे. Double equals == फक्त value check करतो. Logical AND साठी double ampersand && आणि OR साठी double pipe || लिहतो.",
    example: 'let vay = 18;\n\nif (vay >= 18) {\n  console.log("तुम्ही मतदान करू शकता");\n} else {\n  console.log("तुम्ही मतदान करू शकत नाही");\n}\n\nlet marks = 75;\nif (marks >= 90) {\n  console.log("Grade: A");\n} else if (marks >= 75) {\n  console.log("Grade: B");\n} else if (marks >= 60) {\n  console.log("Grade: C");\n} else {\n  console.log("Grade: F");\n}'
  },
  {
    id: 6,
    title: "For Loop",
    content: "For loop ने JavaScript मध्ये एखादे काम अनेक वेळा करवतो. JavaScript चा for loop Python पेक्षा वेगळा दिसतो पण काम तेच करतो. For loop मध्ये तीन parts असतात — initialization जिथे variable बनवतो, condition जी true राहेपर्यंत loop चालतो, आणि update जो प्रत्येक वेळी चालतो. तिन्ही parts semicolon ने वेगळे करतो. let i = 0 पासून सुरू करतो. i less than 5 पर्यंत चालवतो. i++ चा अर्थ आहे i = i + 1. For loop arrays सोबत देखील वापरतात. for...of loop ने array च्या प्रत्येक item वर directly काम करता येते जे खूप सोपे आहे.",
    example: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\n// 1 ते 10 चे squares\nfor (let i = 1; i <= 10; i++) {\n  console.log(i + " चा square आहे " + (i * i));\n}\n\n// Array सोबत for...of\nlet fruits = ["apple", "banana", "mango"];\nfor (let fruit of fruits) {\n  console.log(fruit);\n}'
  },
  {
    id: 7,
    title: "Functions",
    content: "Functions म्हणजे JavaScript मधील reusable code blocks. एकदा function बनवा आणि अनेक वेळा वापरा. JavaScript मध्ये functions बनवण्याचे दोन main मार्ग आहेत. पहिला आहे function declaration ज्यात function keyword लिहतो. दुसरा आहे arrow function जो modern आणि shorter मार्ग आहे. Function call करण्यासाठी त्याचे नाव आणि brackets लिहतो. Parameters म्हणजे त्या values ज्या आपण function ला देतो. return keyword ने function एक value परत देऊ शकते. Functions मुळे code organized आणि readable होतो. Real projects मध्ये functions शिवाय काम होत नाही.",
    example: '// Function declaration\nfunction namaskaar(naam) {\n  console.log("नमस्कार " + naam + "!");\n}\n\n// Arrow function\nconst add = (a, b) => {\n  return a + b;\n};\n\n// Short arrow function\nconst multiply = (a, b) => a * b;\n\nnamaskaar("Sharada");\nnamaskaar("Pyra");\nconsole.log(add(5, 3));\nconsole.log(multiply(4, 6));'
  },
  {
    id: 8,
    title: "Arrays",
    content: "Array म्हणजे एक list जिथे आपण अनेक values एकत्र ठेवतो. JavaScript मध्ये arrays square brackets मध्ये बनवतात. Array चा index 0 पासून सुरू होतो. length property ने array ची size कळते. push() ने नवीन item array च्या शेवटी add होतो. pop() ने शेवटचा item हटतो. forEach() ने array च्या प्रत्येक item वर एक function चालवता येते. map() ने array च्या प्रत्येक item ला transform करून नवीन array बनतो. filter() ने condition नुसार items filter होतात. find() ने पहिला matching item मिळतो. Arrays हे JavaScript मधील सर्वाधिक वापरले जाणारे data structure आहे.",
    example: 'let fruits = ["apple", "banana", "mango"];\n\nconsole.log(fruits[0]);       // apple\nconsole.log(fruits.length);   // 3\n\nfruits.push("orange");\nconsole.log(fruits);          // 4 items\n\nfruits.forEach(fruit => {\n  console.log(fruit);\n});\n\nlet numbers = [1, 2, 3, 4, 5];\nlet doubled = numbers.map(n => n * 2);\nconsole.log(doubled);  // [2, 4, 6, 8, 10]'
  },
  {
    id: 9,
    title: "Objects",
    content: "Object मध्ये आपण related data एकत्र ठेवतो. उदाहरणार्थ एका student चे नाव, वय, आणि marks — हे सर्व एका student object मध्ये ठेवता येतात. Object curly braces मध्ये बनतो. आत key आणि value pairs असतात. Key आणि value colon ने वेगळे करतात. वेगवेगळ्या pairs comma ने वेगळ्या करतात. Object च्या properties पर्यंत पोहोचण्यासाठी dot notation वापरतो. Object मध्ये functions देखील ठेवता येतात ज्यांना methods म्हणतात. Object मध्ये कोणताही data type ठेवता येतो — string, number, array, दुसरा object देखील. Real apps मध्ये data नेहमी objects च्या form मध्ये असतो.",
    example: 'let student = {\n  naam: "Sharada",\n  vay: 20,\n  shahar: "Pune",\n  marks: [85, 90, 78],\n  greet: function() {\n    console.log("नमस्कार, मी " + this.naam + " आहे");\n  }\n};\n\nconsole.log(student.naam);\nconsole.log(student.vay);\nconsole.log(student.marks[0]);\nstudent.greet();'
  },
  {
    id: 10,
    title: "DOM Manipulation",
    content: "DOM चे पूर्ण नाव आहे Document Object Model. DOM ने आपण JavaScript च्या मदतीने webpage चे elements बदलू शकतो. उदाहरणार्थ button click केल्यावर text बदलणे, color बदलणे, किंवा नवीन element add करणे. getElementById() ने एखाद्या element ला त्याच्या id ने शोधतो. querySelector() ने CSS selector सारखा element शोधतो. innerHTML ने element चा content बदलतो. style ने element ची CSS बदलतो. addEventListener ने button click किंवा keyboard press सारखे events ऐकतो. DOM manipulation मुळेच websites interactive होतात. हे JavaScript चे सर्वात powerful feature आहे.",
    example: '// HTML मध्ये: <h1 id="title">जुना Title</h1>\n// HTML मध्ये: <button id="btn">Click करा</button>\n\n// Title बदला\ndocument.getElementById("title").innerHTML = "नवीन Title!";\n\n// Color बदला\ndocument.getElementById("title").style.color = "blue";\n\n// Button click वर action\ndocument.getElementById("btn").addEventListener("click", function() {\n  alert("Button click झाला!");\n});'
  },
]


// Dark + saffron brand palette — matches Login/Register/Intro/LanguagePage
const ACCENT = "#f4a261"
const ACCENT_SOFT = "rgba(244, 162, 97, 0.15)"
const CREAM = "#f1ede4"
const CREAM_MUTED = "rgba(241, 237, 228, 0.6)"


function LessonsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "दोस्त"
  const language = location.state?.language || "python"
  const instructionLang = location.state?.instructionLang || "hindi"
  const userId = location.state?.user_id
  const lessons = instructionLang === "english"
  ? (language === "sql" ? sqlLessonsEnglish : language === "javascript" ? javascriptLessonsEnglish : pythonLessonsEnglish)
  : instructionLang === "marathi"
  ? (language === "sql" ? sqlLessonsMarathi : language === "javascript" ? javascriptLessonsMarathi : pythonLessonsMarathi)
  : (language === "sql" ? sqlLessons : language === "javascript" ? javascriptLessons : pythonLessons)
  const lang = t[instructionLang]
  const [progressData, setProgressData] = useState({ lessons_done: false, mcq_done: false, agent_done: false, current_lesson_index: 0 })
  const [currentLesson, setCurrentLesson] = useState(0)
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
      let preferred = null
      if (lang.voiceLang === "en-US") {
        preferred = voices.find(v => v.name === "Microsoft Zira - English (United States)")
      } else if (lang.voiceLang === "hi-IN") {
        preferred = voices.find(v => v.name === "Google हिन्दी")
      }
      if (!preferred) {
        preferred = voices.find(v => v.lang === lang.voiceLang)
      }
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
  if (!userId) return
  fetch(`http://127.0.0.1:8000/progress/${userId}`)
    .then(res => res.json())
    .then(data => {
      const match = data.progress?.find(p => p.language === language)
      if (match) {
        setProgressData(match)
        const savedIndex = match.current_lesson_index || 0
        if (savedIndex > 0 && savedIndex < lessons.length) {
          setCurrentLesson(savedIndex)
        }
      }
    })
    .catch(() => {})
}, [userId, language])

  
  useEffect(() => {
    setTimeout(() => {
      speak(
        lang.welcome(name) + " " +
        lang.pressL + " " +
        lang.pressN + " " +
        lang.pressR
      )
      setStatus(lang.status)
      setStep("ready")
    }, 1000)
  }, [])

 async function playLesson() {
    const lesson = lessons[currentLesson]
    speak(lang.loading(lesson.id))
    setStatus(lang.loading(lesson.id))
    setStep("playing")

    let text = "Lesson " + lesson.id + ". " + lesson.title + ". " + lesson.content
    if (lesson.example) text += " " + lang.example + " " + lesson.example
    text += " " + lang.understood + " " + lang.nextLesson
    speak(text)
   setStatus("R = " + lang.repeatBtn + " | N = " + lang.nextBtn)
  }

  function updateProgress(fields) {
    setProgressData(prev => ({ ...prev, ...fields }))
    if (!userId) return
    fetch("http://127.0.0.1:8000/progress/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, language, ...fields }),
    }).catch(() => {})
  }

 function nextLesson() {
  if (currentLesson < lessons.length - 1) {
    const newIndex = currentLesson + 1
    setCurrentLesson(newIndex)
    setStep("ready")
    speak(lang.excellent + " " + lang.pressL)
    setStatus(lang.pressL)
    if (newIndex > (progressData.current_lesson_index || 0)) {
      updateProgress({ current_lesson_index: newIndex })
    }
  } else {
    updateProgress({ lessons_done: true, current_lesson_index: lessons.length - 1 })
    speak(lang.allDone(name))
    setStep("done")
    setStatus(lang.allDone(name))
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
      if (answer.includes("हाँ") || answer.includes("हां") || answer.includes("ha") || answer.includes("yes")) {
        nextLesson()
      } else {
        speak("ठीक है, दोबारा सुनते हैं।")
        setTimeout(() => playLesson(), 1500)
      }
    }
    recognition.onerror = () => { setListening(false); setStatus("सुनाई नहीं दिया") }
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === "INPUT") return
      const key = e.key.toLowerCase()
      if (key === "l") playLesson()
      if (key === "n" && step === "done") navigate("/mcq", { state: { name, language, instructionLang, user_id: userId } })
      if (key === "n" && step !== "done") nextLesson()
      if (key === "r") speak(lastMessage)
      if (key === "t") startListening()
      if (key === "1") navigate("/lessons", { state: { name, language, instructionLang, user_id: userId } })
      if (key === "2") navigate("/mcq", { state: { name, language, instructionLang, user_id: userId } })
      if (key === "3") navigate("/agent", { state: { name, user_id: userId } })
      if (key === "m") toggleTheme()
      if (key === "b") document.getElementById("sidebar-toggle")?.click()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [currentLesson, step, lastMessage])

  const lesson = lessons[currentLesson]
  const progress = Math.round((currentLesson / lessons.length) * 100)

  return (
    
    <main aria-label="Lessons पृष्ठ" style={{
      minHeight: "100vh",
      background: bg,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem" , fontSize: fontSize + "px"
    }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
     <Navbar
  name={name} theme={theme} toggleTheme={toggleTheme}
  fontSize={fontSize} setFontSize={setFontSize}
  speed={speed} setSpeed={setSpeed}
  language={language} instructionLang={instructionLang}
  userId={userId}
/>
       <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.5rem", alignItems: "start" }}>

          <LessonSidebar
  lessons={lessons}
  currentLesson={currentLesson}
  setCurrentLesson={setCurrentLesson}
  setStep={setStep}
  theme={theme}
  cardBg={cardBg}
  cardBorder={cardBorder}
  mutedColor={mutedColor}
  speak={speak}
/>

          <div>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h1 style={{ color: ACCENT, fontSize: "1.8rem", margin: "0", fontWeight: 600 }}>
  {language === "sql" ? "SQL" : language === "javascript" ? "JavaScript" : "Python"} Lessons
</h1>
              <p style={{ color: mutedColor, margin: "0.3rem 0 0" }}>नमस्ते {name}!</p>
            </div>
            <ProgressBar
              lessons={progressData.lessons_done}
              mcq={progressData.mcq_done}
              agent={progressData.agent_done}
              theme={theme}
            />

            <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "0.8rem 1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ color: mutedColor, fontSize: "0.85rem" }}>Lesson Progress</span>
                <span style={{ color: ACCENT, fontSize: "0.85rem" }}>{currentLesson}/{lessons.length}</span>
              </div>
              <div style={{ background: ACCENT_SOFT, borderRadius: "8px", height: "8px" }}>
                <div style={{ background: ACCENT, width: progress + "%", height: "8px", borderRadius: "8px", transition: "width 0.5s" }} />
              </div>
            </div>

            <div aria-live="polite" style={{ background: cardBg, border: "1px solid " + cardBorder, padding: "1.5rem", borderRadius: "16px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <span style={{ background: ACCENT, color: "#1a1410", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.9rem" }}>{lesson.id}</span>
                <h2 style={{ color: ACCENT, margin: "0", fontSize: "1.2rem" }}>{lesson.title}</h2>
              </div>
              <p style={{ color: textColor, lineHeight: "1.7", marginBottom: lesson.example ? "1rem" : "0" }}>{lesson.content}</p>
              {lesson.example && (
                <div style={{ background: codeBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem" }}>
                  <p style={{ color: mutedColor, fontSize: "0.8rem", margin: "0 0 0.5rem" }}>उदाहरण:</p>
                  <pre style={{ color: "#22c55e", margin: "0", fontSize: "1rem", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{lesson.example}</pre>
                </div>
              )}
              {status !== "" && (
                <p aria-live="assertive" style={{ marginTop: "1rem", color: ACCENT, fontSize: "0.9rem", background: "#2a1a0e", padding: "0.5rem 1rem", borderRadius: "8px" }}>{status}</p>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.8rem" }}>
              <button onClick={playLesson} aria-label="L — Lesson सुनें" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: ACCENT, color: "#1a1410", border: "none", cursor: "pointer", fontWeight: "bold" }}>
  {lang.listenBtn}<br /><span style={{ fontSize: "0.75rem" }}>(L)</span>
</button>
              <button onClick={() => speak(lastMessage)} aria-label="R — दोबारा सुनें" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "transparent", color: CREAM_MUTED, border: `1px solid ${ACCENT_SOFT}`, cursor: "pointer", fontWeight: "bold" }}>
                दोबारा<br /><span style={{ fontSize: "0.75rem", color: ACCENT }}>(R)</span>
              </button>
              <button onClick={startListening} disabled={listening} aria-label="T — आवाज़ से जवाब दें" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: listening ? ACCENT_SOFT : "transparent", color: listening ? ACCENT : CREAM_MUTED, border: `1px solid ${ACCENT_SOFT}`, cursor: "pointer", fontWeight: "bold" }}>
                {listening ? "सुन रही हूँ" : "बोलें"}<br /><span style={{ fontSize: "0.75rem", color: ACCENT }}>(T)</span>
              </button>
              <button onClick={step === "done" ? () => navigate("/mcq", { state: { name, language, instructionLang, user_id: userId  } }) : nextLesson} aria-label="N — अगला lesson" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: ACCENT, color: "#1a1410", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                {step === "done" ? "MCQ" : "अगला →"}<br /><span style={{ fontSize: "0.75rem" }}>(N)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

export default LessonsPage