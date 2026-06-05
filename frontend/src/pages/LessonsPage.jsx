import { t } from "../components/translations"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { speak as speakUtil } from "../components/speak"
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
  { id: 1,
    title: "Python म्हणजे काय?",
    content: "Python ही एक programming language आहे. सोप्या भाषेत सांगायचे तर — Python हा एक मार्ग आहे ज्याने आपण computer ला सूचना देतो. जसे आपण एखाद्या माणसाशी मराठीत बोलतो, तसेच आपण computer शी Python मध्ये बोलतो. Python 1991 साली Guido van Rossum नावाच्या एका शास्त्रज्ञाने बनवली होती. Python खास आहे कारण ती वाचायला आणि समजायला खूप सोपी आहे. Python सारखी दिसते ती जवळजवळ इंग्रजी भाषेसारखीच असते. Python वापरून आपण websites बनवू शकतो, games बनवू शकतो, Artificial Intelligence बनवू शकतो, आणि data analysis करू शकतो. जगातील मोठ्या companies जसे Google, Netflix, आणि Instagram देखील Python वापरतात. Python ही beginners साठी सर्वात चांगली programming language आहे कारण तिचे rules खूप सोपे आहेत. आपण या course मध्ये Python शिकणार आहोत आणि स्वतःचे programs बनवणार आहोत.",
    example: null },
  { id: 2,
    title: "print() function",
    content: "print() function हे Python मधील सर्वात पहिले आणि सर्वात महत्त्वाचे function आहे. print चा अर्थ आहे — screen वर काहीतरी दाखवणे. आपण print च्या brackets च्या आत जे काही लिहितो ते computer च्या screen वर दिसते. उदाहरणार्थ जर आपण print नमस्कार लिहिले तर screen वर नमस्कार दिसेल. Text लिहिताना त्याला quotes च्या आत लिहणे आवश्यक आहे. आपण numbers देखील print करू शकतो आणि एकाच वेळी दोन गोष्टी एकत्र print करू शकतो. print() function मध्ये comma वापरून अनेक गोष्टी एका ओळीत print करता येतात. प्रत्येक Python programmer रोज print() function वापरतो. हे function debugging साठी देखील खूप उपयुक्त आहे म्हणजे program मध्ये काय चालू आहे हे तपासण्यासाठी.",
    example: 'print("नमस्कार जग!")\nprint(42)\nprint("माझे नाव", "Pyra", "आहे")\nprint("आज", 2024, "साल आहे")' },
  { id: 3, title: "Variables",
    content: "Variable ला आपण एक डबा किंवा खोकं समजू शकतो. जसे घरात वेगवेगळ्या डब्यांमध्ये साखर, मीठ, आणि तांदूळ ठेवतो, तसेच computer मध्ये वेगवेगळ्या variables मध्ये वेगवेगळा data ठेवतो. प्रत्येक variable ला एक नाव असते. त्या नावाने आपण तो data नंतर वापरू शकतो. उदाहरणार्थ naam नावाच्या variable मध्ये Sharada ठेवले, तर जेव्हाही naam लिहू तेव्हा Sharada मिळेल. Variable बनवण्यासाठी आधी नाव लिहा, मग equal sign, मग value. Variable चे नाव नेहमी लहान अक्षरांमध्ये लिहतात आणि मध्ये space नसते. जर नावात दोन शब्द असतील तर underscore वापरतात जसे my_name. Variable ची value नंतर बदलता येते. एकदा variable बनवला की तो program संपेपर्यंत आपल्याला वापरता येतो.",
    example: 'naam = "Sharada"\nvay = 20\nshahar = "Pune"\nprint(naam)\nprint(vay)\nprint(shahar)' },
  { id: 4, title: "Data Types",
    content: "Python मध्ये वेगवेगळ्या प्रकारचा data असतो ज्यांना Data Types म्हणतात. पहिला आहे int म्हणजे पूर्ण संख्या जसे 5, 10, 100, 1000. दुसरा आहे float म्हणजे दशांश संख्या जसे 3.14, 5.5, 9.99. तिसरा आहे string म्हणजे text जसे नमस्कार, Sharada, Pune. string नेहमी quotes च्या आत लिहतात. चौथा आहे bool ज्यामध्ये फक्त दोन values असतात — True किंवा False. उदाहरणार्थ आज पाऊस आहे का? True किंवा False. Python स्वतः समजते की कोणता data type आहे. आपल्याला वेगळे सांगायची गरज नाही. हे Python ची सर्वात चांगली खासियत आहे. type() function वापरून आपण कोणत्याही variable चा data type तपासू शकतो.",
    example: 'vay = 20\nunchaai = 5.6\nnaam = "Pyra"\nkya_vidyarthi_ahe = True\nprint(vay)\nprint(unchaai)\nprint(naam)\nprint(kya_vidyarthi_ahe)\nprint(type(vay))\nprint(type(naam))' },
  { id: 5, title: "User कडून Input घेणे",
    content: "आतापर्यंत आपण स्वतःच data लिहिला. पण real programs मध्ये user कडून data घ्यावा लागतो. यासाठी Python मध्ये input() function आहे. input() function screen वर एक प्रश्न दाखवतो आणि user चे उत्तर ऐकतो. user जे काही type करतो ते एका variable मध्ये save होते. उदाहरणार्थ जर आपण विचारले तुमचे नाव काय आहे, तर user जे नाव type करेल ते naam variable मध्ये save होईल. मग आपण तो naam print करू शकतो. हे खूप महत्त्वाचे आहे कारण प्रत्येक app मध्ये user कडून काही ना काही घ्यावे लागते. एक महत्त्वाची गोष्ट — input() function नेहमी string देते. जर आपल्याला number हवे असेल तर int() किंवा float() वापरून convert करावे लागते.",
    example: 'naam = input("तुमचे नाव काय आहे? ")\nvay = int(input("तुमचे वय किती आहे? "))\nprint("नमस्कार", naam)\nprint("तुमचे वय आहे", vay)\nprint("10 वर्षांनी तुम्ही", vay + 10, "वर्षांचे असाल")' },
  { id: 6, title: "If/Else Conditions",
    content: "If/Else ने आपण computer ला निर्णय घेण्यास शिकवतो. जसे आपण विचार करतो — जर पाऊस असेल तर छत्री घे, नाहीतर उन्हाचा चष्मा घे. तसेच Python मध्ये if लिहून condition लिहतो. जर condition बरोबर असेल तर if वाला code चालतो. जर condition चुकीची असेल तर else वाला code चालतो. Condition मध्ये आपण greater than, less than, equal to असे operators वापरतो. if च्या नंतर colon लावणे आवश्यक आहे आणि पुढच्या ओळीत 4 spaces चे indentation देणे आवश्यक आहे. elif वापरून अनेक conditions तपासता येतात. elif म्हणजे else if. आपण एकाच वेळी if, elif, आणि else एकत्र वापरू शकतो. हे Python चा खूप महत्त्वाचा concept आहे.",
    example: 'vay = 18\nif vay >= 18:\n    print("तुम्ही मतदान करू शकता")\nelse:\n    print("तुम्ही मतदान करू शकत नाही")\n\nmarks = 75\nif marks >= 90:\n    print("Grade: A")\nelif marks >= 75:\n    print("Grade: B")\nelif marks >= 60:\n    print("Grade: C")\nelse:\n    print("Grade: F")' },
  { id: 7, title: "For Loop",
    content: "For loop ने आपण एखादे काम अनेक वेळा करवू शकतो. जर आपल्याला 1 ते 100 पर्यंत मोजायचे असेल तर काय आपण 100 वेळा print लिहणार? नाही! यासाठी for loop वापरतो. for loop मध्ये range() function वापरतात. range(1, 6) चा अर्थ आहे 1 ते 5 पर्यंत. प्रत्येक वेळी loop चालल्यावर i ची value बदलते. पहिल्यांदा i=1, दुसऱ्यांदा i=2, आणि असे पुढे जाते. for loop चा उपयोग list च्या प्रत्येक item वर काम करण्यासाठी देखील होतो. range() मध्ये तिसरा parameter step असतो. जसे range(0, 10, 2) म्हणजे 0, 2, 4, 6, 8 — दोन दोन करून. Loops हे programming चे सर्वात महत्त्वाचे concept आहे.",
    example: "for i in range(1, 6):\n    print(i)\n\nfor i in range(1, 11):\n    print(i, 'चा square आहे', i*i)\n\nfor i in range(10, 0, -1):\n    print(i, '...')\nprint('सुरुवात!')" },
  { id: 8, title: "While Loop",
    content: "While loop तोपर्यंत चालतो जोपर्यंत एखादी condition बरोबर असते. जसे — जोपर्यंत पाणी मिळत नाही तोपर्यंत चालत राहा. हे for loop पेक्षा वेगळे आहे. for loop मध्ये आपल्याला आधीच माहीत असते की किती वेळा चालेल. while loop मध्ये condition वर अवलंबून असते. while loop बद्दल एक गोष्ट खूप महत्त्वाची आहे — loop च्या आत असे काहीतरी असायला हवे जे condition ला eventually false करेल. नाहीतर loop नेहमी चालत राहील ज्याला infinite loop म्हणतात. count = count + 1 म्हणूनच लिहतो जेणेकरून loop बंद होईल. while loop password check करण्यासाठी, game मध्ये, आणि user input घेण्यासाठी खूप उपयुक्त आहे.",
    example: "count = 1\nwhile count <= 5:\n    print(count)\n    count = count + 1\n\npassword = ''\nwhile password != 'hello':\n    password = input('Passwor d टाका: ')\nprint('बरोबर password!')"},
  { id: 9, title: "Lists",
    content: "List एखाद्या पिशवीसारखी आहे ज्यात आपण अनेक गोष्टी एकत्र ठेवू शकतो. जसे एका पिशवीत सफरचंद, केळे, आणि आंबा ठेवतो, तसेच list मध्ये अनेक values ठेवता येतात. List square brackets मध्ये लिहतात आणि items ला comma ने वेगळे करतात. List मधील प्रत्येक item ला एक number असतो ज्याला index म्हणतात. Index नेहमी 0 पासून सुरू होतो. म्हणजे पहिला item index 0 वर आहे, दुसरा index 1 वर. len() function ने list मध्ये किती items आहेत हे कळते. append() ने नवीन item add करता येतो. remove() ने item हटवता येतो. List मधील कोणताही item बदलता येतो. Lists हे Python मधील सर्वात उपयुक्त data structure आहे.",
    example: 'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])\nprint(fruits[1])\nprint(len(fruits))\nfruits.append("orange")\nprint(fruits)\nfruits.remove("banana")\nprint(fruits)' },
  { id: 10, title: "Functions",
    content: "Function हा एक छोटा program असतो जो एक specific काम करतो. Function चा सर्वात मोठा फायदा म्हणजे एकदा लिहा आणि अनेक वेळा वापरा. जसे TV चा remote एक function आहे — तो एकदा बनवला आणि अनेक वेळा वापरतो. def keyword ने function बनवतात. def च्या नंतर function चे नाव लिहतात, मग brackets मध्ये parameters. Parameters म्हणजे त्या values ज्या आपण function ला देतो. Function च्या आत चा code तेव्हा चालतो जेव्हा आपण function ला call करतो. Function call करण्यासाठी function चे नाव आणि brackets लिहतात. return keyword वापरून function एखादे value परत देऊ शकते. Functions मुळे code neat आणि reusable होतो.",
    example: 'def namaskaar(naam):\n    print("नमस्कार", naam, "जी!")\n\ndef add(a, b):\n    result = a + b\n    return result\n\nnamaskaar("Sharada")\nnamaskaar("Pyra")\nans = add(5, 3)\nprint("5 + 3 =", ans)\nprint("10 + 20 =", add(10, 20))' },
  { id: 11, title: "String Operations",
    content: "String म्हणजे text. String सोबत आपण खूप काही करू शकतो. दोन strings जोडण्यासाठी plus operator वापरतो. upper() ने सर्व अक्षरे मोठी होतात. lower() ने सर्व अक्षरे लहान होतात. len() ने string मध्ये किती characters आहेत हे कळते. replace() ने एखादा शब्द बदलता येतो. split() ने string चे parts करता येतात. in keyword ने check करता येते की एखादा शब्द string मध्ये आहे की नाही. strip() ने string च्या सुरुवातीचे आणि शेवटचे spaces हटवता येतात. String operations खूप उपयुक्त आहेत कारण real programs मध्ये text सोबत खूप काम करावे लागते. Forms, messages, files — सगळीकडे strings असतात.",
    example: 'naam = "sharada"\nprint(naam.upper())\nprint(naam.lower())\nprint(len(naam))\nprint("नमस्कार " + naam)\nprint(naam.replace("sharada", "pyra"))\nprint("sha" in naam)\nwords = "apple,banana,mango"\nprint(words.split(","))' },
  { id: 12, title: "Math Operations",
    content: "Python एक उत्तम calculator देखील आहे. बेरजेसाठी plus, वजाबाकीसाठी minus, गुणाकारासाठी star, भागाकारासाठी slash वापरतो. बाकी म्हणजे remainder साठी percent sign वापरतो. Double star ने power काढता येतो जसे 2 ची power 3 म्हणजे 8. Double slash ने floor division होतो जो भागाकारानंतर decimal हटवतो. Python मध्ये math module देखील असतो ज्याने square root, trigonometry सारख्या calculations करता येतात. import math लिहून हा module वापरता येतो. math.sqrt() ने square root, math.pi ने pi ची value मिळते. Calculator बनवण्यात हेच सर्व operations काम येतात.",
    example: "a = 10\nb = 3\nprint('बेरीज:', a + b)\nprint('वजाबाकी:', a - b)\nprint('गुणाकार:', a * b)\nprint('भागाकार:', a / b)\nprint('बाकी:', a % b)\nprint('घात:', 2 ** 10)\n\nimport math\nprint('Square root of 16:', math.sqrt(16))" },
  { id: 13, title: "Comments",
    content: "Comments म्हणजे त्या ओळी ज्या Python run करत नाही. Comments फक्त आपल्या developers साठी असतात — code समजावून सांगण्यासाठी. जसे पुस्तकात notes लिहतो, तसेच code मध्ये comments लिहतो. Hash symbol म्हणजे # ने single line comment बनवतो. # च्या नंतर जे काही लिहाल ते Python ignore करते. Comments लिहणे खूप महत्त्वाचे आहे कारण नंतर जेव्हा आपण आपला code दुबारा वाचू किंवा दुसरा कोणी वाचेल तर समजेल. चांगले programmers नेहमी comments लिहतात. Comments मुळे team work करणे सोपे होते. एक professional programmer म्हणून comments लिहणे ही सवय लावून घ्या.",
    example: "# हे एक simple calculator आहे\na = 10  # पहिला number\nb = 5   # दुसरा number\n\n# बेरीज करतो\nresult = a + b\nprint('बेरीज:', result)  # result print करा\n\n# हे program Sharada ने लिहिले आहे" },
  { id: 14, title: "Error Handling",
    content: "जेव्हा Python ला एखादी चूक सापडते तेव्हा program बंद होतो. पण real apps मध्ये आपल्याला program बंद व्हायला नको असतो. यासाठी try आणि except वापरतो. try च्या आत तो code लिहतो ज्यात error येऊ शकते. जर error आली तर except वाला code चालतो आणि program बंद होत नाही. उदाहरणार्थ जर आपण एखाद्या number ला zero ने divide केले तर error येते. try आणि except ने ती error पकडून user ला एक चांगला message देऊ शकतो. ZeroDivisionError म्हणजे zero ने divide केल्याची error. ValueError म्हणजे चुकीच्या type ची value दिली तेव्हा येणारी error. finally block नेहमी चालतो मग error असो किंवा नसो. हे professional programming चा खूप महत्त्वाचा भाग आहे.",
    example: "try:\n    result = 10 / 0\n    print(result)\nexcept ZeroDivisionError:\n    print('चूक! शून्याने भाग होत नाही')\n\ntry:\n    number = int('hello')\nexcept ValueError:\n    print('चूक! हे number नाही')\nfinally:\n    print('Program चालू आहे')" },
  { id: 15, title: "Mini Project — Calculator",
    content: "शाब्बास! तुम्ही Python चे सर्व basic concepts शिकलात. आता आपण हे सर्व एकत्र करून एक real calculator बनवूया. या calculator मध्ये आपण functions वापरू, if/else conditions वापरू, आणि variables वापरू. हे तुमचे पहिले Python project आहे. हे बनवल्यावर तुम्ही म्हणू शकता की मी Python मध्ये एक program बनवला आहे. हा calculator दोन numbers घेतो, operation विचारतो, आणि result देतो. या project मध्ये आपण शिकलेल्या सर्व गोष्टी एकत्र आल्या आहेत — variables, functions, if/elif/else, आणि return. पुढे जाऊन तुम्ही हा calculator आणखी चांगला बनवू शकता जसे की history ठेवणे किंवा square root add करणे.",
    example: 'def calculator(a, b, operation):\n    if operation == "+":\n        return a + b\n    elif operation == "-":\n        return a - b\n    elif operation == "*":\n        return a * b\n    elif operation == "/":\n        if b != 0:\n            return a / b\n        else:\n            return "शून्याने भाग होत नाही"\n    else:\n        return "चुकीचे operation"\n\nprint(calculator(10, 5, "+"))\nprint(calculator(10, 5, "-"))\nprint(calculator(10, 5, "*"))\nprint(calculator(10, 5, "/"))' },
]



const sqlLessons = [
  { id: 1, title: "SQL क्या है?", content: "SQL यानी Structured Query Language। इससे हम database से data निकालते हैं, डालते हैं, और बदलते हैं। SQL सीखना बहुत जरूरी है क्योंकि सभी apps में database होता है।", example: null },
  { id: 2, title: "SELECT Statement", content: "SELECT से हम database से data निकालते हैं। यह SQL का सबसे जरूरी command है।", example: "SELECT * FROM students;" },
  { id: 3, title: "WHERE Clause", content: "WHERE से हम condition लगाकर specific data निकालते हैं।", example: "SELECT * FROM students\nWHERE age > 18;" },
  { id: 4, title: "INSERT Statement", content: "INSERT से हम database में नया data डालते हैं।", example: "INSERT INTO students (naam, age)\nVALUES ('Sharada', 20);" },
  { id: 5, title: "UPDATE Statement", content: "UPDATE से हम database में पुराना data बदलते हैं।", example: "UPDATE students\nSET age = 21\nWHERE naam = 'Sharada';" },
  { id: 6, title: "DELETE Statement", content: "DELETE से हम database से data हटाते हैं।", example: "DELETE FROM students\nWHERE naam = 'Sharada';" },
  { id: 7, title: "CREATE TABLE", content: "CREATE TABLE से हम नई table बनाते हैं।", example: "CREATE TABLE students (\n  id INT,\n  naam VARCHAR(50),\n  age INT\n);" },
  { id: 8, title: "ORDER BY", content: "ORDER BY से हम data को sort करते हैं।", example: "SELECT * FROM students\nORDER BY age DESC;" },
  { id: 9, title: "COUNT Function", content: "COUNT से हम rows की संख्या निकालते हैं।", example: "SELECT COUNT(*)\nFROM students;" },
  { id: 10, title: "JOIN", content: "JOIN से हम दो tables को जोड़कर data निकालते हैं।", example: "SELECT students.naam, marks.score\nFROM students\nJOIN marks ON students.id = marks.id;" },
]


const sqlLessonsEnglish = [
  { id: 1, title: "What is SQL?", content: "SQL stands for Structured Query Language. We use it to get data from a database, add new data, and change existing data. SQL is very important because every app uses a database.", example: null },
  { id: 2, title: "SELECT Statement", content: "SELECT is used to get data from a database. It is the most important SQL command.", example: "SELECT * FROM students;" },
  { id: 3, title: "WHERE Clause", content: "WHERE is used to filter data based on a condition.", example: "SELECT * FROM students\nWHERE age > 18;" },
  { id: 4, title: "INSERT Statement", content: "INSERT is used to add new data into a database.", example: "INSERT INTO students (name, age)\nVALUES ('Sharada', 20);" },
  { id: 5, title: "UPDATE Statement", content: "UPDATE is used to change existing data in a database.", example: "UPDATE students\nSET age = 21\nWHERE name = 'Sharada';" },
  { id: 6, title: "DELETE Statement", content: "DELETE is used to remove data from a database.", example: "DELETE FROM students\nWHERE name = 'Sharada';" },
  { id: 7, title: "CREATE TABLE", content: "CREATE TABLE is used to create a new table in a database.", example: "CREATE TABLE students (\n  id INT,\n  name VARCHAR(50),\n  age INT\n);" },
  { id: 8, title: "ORDER BY", content: "ORDER BY is used to sort data in ascending or descending order.", example: "SELECT * FROM students\nORDER BY age DESC;" },
  { id: 9, title: "COUNT Function", content: "COUNT is used to count the number of rows in a table.", example: "SELECT COUNT(*)\nFROM students;" },
  { id: 10, title: "JOIN", content: "JOIN is used to combine data from two tables.", example: "SELECT students.name, marks.score\nFROM students\nJOIN marks ON students.id = marks.id;" },
]

const javascriptLessons = [
  { id: 1, title: "JavaScript क्या है?", content: "JavaScript एक programming language है जो websites को interactive बनाती है। हर website में JavaScript होती है। इसे browser directly समझता है।", example: null },
  { id: 2, title: "console.log()", content: "console.log() से हम browser console में कुछ भी print कर सकते हैं।", example: 'console.log("नमस्ते दुनिया!");' },
  { id: 3, title: "Variables", content: "JavaScript में let, const, और var से variables बनाते हैं।", example: 'let naam = "Sharada";\nconst umar = 20;\nconsole.log(naam);' },
  { id: 4, title: "Data Types", content: "JavaScript में string, number, boolean, null, undefined होते हैं।", example: 'let name = "Pyra";\nlet age = 20;\nlet isStudent = true;' },
  { id: 5, title: "If/Else", content: "If/Else से condition check करते हैं।", example: 'let umar = 18;\nif (umar >= 18) {\n  console.log("Vote कर सकते हैं");\n} else {\n  console.log("नहीं कर सकते");\n}' },
  { id: 6, title: "For Loop", content: "For loop से काम बार बार करते हैं।", example: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}" },
  { id: 7, title: "Functions", content: "Function से code को reuse करते हैं।", example: 'function namaste(naam) {\n  console.log("नमस्ते " + naam);\n}\nnamaste("Sharada");' },
  { id: 8, title: "Arrays", content: "Array में हम कई values एक साथ रखते हैं।", example: 'let fruits = ["apple", "banana", "mango"];\nconsole.log(fruits[0]);\nconsole.log(fruits.length);' },
  { id: 9, title: "Objects", content: "Object में हम related data एक साथ रखते हैं।", example: 'let student = {\n  naam: "Sharada",\n  age: 20\n};\nconsole.log(student.naam);' },
  { id: 10, title: "DOM Manipulation", content: "DOM से हम webpage के elements को JavaScript से बदल सकते हैं।", example: 'document.getElementById("title")\n  .innerHTML = "नमस्ते!";' },
]


const javascriptLessonsEnglish = [
  { id: 1, title: "What is JavaScript?", content: "JavaScript is a programming language that makes websites interactive. Every website uses JavaScript. The browser understands it directly.", example: null },
  { id: 2, title: "console.log()", content: "console.log() prints anything to the browser console.", example: 'console.log("Hello World!");' },
  { id: 3, title: "Variables", content: "In JavaScript we use let, const, and var to create variables.", example: 'let name = "Sharada";\nconst age = 20;\nconsole.log(name);' },
  { id: 4, title: "Data Types", content: "JavaScript has string, number, boolean, null, and undefined data types.", example: 'let name = "Pyra";\nlet age = 20;\nlet isStudent = true;' },
  { id: 5, title: "If/Else", content: "If and Else are used to check conditions.", example: 'let age = 18;\nif (age >= 18) {\n  console.log("Can vote");\n} else {\n  console.log("Cannot vote");\n}' },
  { id: 6, title: "For Loop", content: "A for loop repeats a task many times.", example: "for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}" },
  { id: 7, title: "Functions", content: "Functions help us reuse code.", example: 'function greet(name) {\n  console.log("Hello " + name);\n}\ngreet("Sharada");' },
  { id: 8, title: "Arrays", content: "Arrays store many values together.", example: 'let fruits = ["apple", "banana", "mango"];\nconsole.log(fruits[0]);\nconsole.log(fruits.length);' },
  { id: 9, title: "Objects", content: "Objects store related data together.", example: 'let student = {\n  name: "Sharada",\n  age: 20\n};\nconsole.log(student.name);' },
  { id: 10, title: "DOM Manipulation", content: "DOM lets us change webpage elements using JavaScript.", example: 'document.getElementById("title")\n  .innerHTML = "Hello!";' },
]



function LessonsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "दोस्त"
  const language = location.state?.language || "python"
const instructionLang = location.state?.instructionLang || "hindi"  // ✅ moved up
const lessons = instructionLang === "english"
  ? (language === "sql" ? sqlLessonsEnglish : language === "javascript" ? javascriptLessonsEnglish : pythonLessonsEnglish)
  : instructionLang === "marathi"
  ? pythonLessonsMarathi
  : (language === "sql" ? sqlLessons : language === "javascript" ? javascriptLessons : pythonLessons)
 const lang = t[instructionLang]
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

  function nextLesson() {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson((prev) => prev + 1)
      setStep("ready")
      speak(lang.excellent + " " + lang.pressL)
      setStatus(lang.pressL)
    } else {
      localStorage.setItem("lessons_done", "true")
      speak(lang.allDone(name))
      setStep("done")
      setStatus(lang.allDone(name))
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
      if (key === "n" && step === "done") navigate("/mcq", { state: { name, language } })
      if (key === "n" && step !== "done") nextLesson()
      if (key === "r") speak(lastMessage)
      if (key === "t") startListening()
      if (key === "1") navigate("/lessons", { state: { name } })
      if (key === "2") navigate("/mcq", { state: { name, language } })
      if (key === "3") navigate("/agent", { state: { name } })
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
  <Navbar name={name} theme={theme} toggleTheme={toggleTheme} fontSize={fontSize} setFontSize={setFontSize} speed={speed} setSpeed={setSpeed} language={language} />

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 300px", gap: "1.5rem", alignItems: "start" }}>

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
              <h1 style={{ color: "#a0a0ff", fontSize: "1.8rem", margin: "0" }}>
  {language === "sql" ? "🗄️ SQL" : language === "javascript" ? "🌐 JavaScript" : "🐍 Python"} Lessons
</h1>
              <p style={{ color: mutedColor, margin: "0.3rem 0 0" }}>नमस्ते {name}!</p>
            </div>

            <div style={{ background: cardBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "0.8rem 1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ color: mutedColor, fontSize: "0.85rem" }}>Lesson Progress</span>
                <span style={{ color: "#a0a0ff", fontSize: "0.85rem" }}>{currentLesson}/{lessons.length}</span>
              </div>
              <div style={{ background: "#2a2a4e", borderRadius: "8px", height: "8px" }}>
                <div style={{ background: "#a0a0ff", width: progress + "%", height: "8px", borderRadius: "8px", transition: "width 0.5s" }} />
              </div>
            </div>

            <div aria-live="polite" style={{ background: cardBg, border: "1px solid " + cardBorder, padding: "1.5rem", borderRadius: "16px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <span style={{ background: "#a0a0ff", color: "#000", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.9rem" }}>{lesson.id}</span>
                <h2 style={{ color: "#a0a0ff", margin: "0", fontSize: "1.2rem" }}>{lesson.title}</h2>
              </div>
              <p style={{ color: textColor, lineHeight: "1.7", marginBottom: lesson.example ? "1rem" : "0" }}>{lesson.content}</p>
              {lesson.example && (
                <div style={{ background: codeBg, border: "1px solid " + cardBorder, borderRadius: "12px", padding: "1rem" }}>
                  <p style={{ color: mutedColor, fontSize: "0.8rem", margin: "0 0 0.5rem" }}>उदाहरण:</p>
                  <pre style={{ color: "#22c55e", margin: "0", fontSize: "1rem", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{lesson.example}</pre>
                </div>
              )}
              {status !== "" && (
                <p aria-live="assertive" style={{ marginTop: "1rem", color: "#f4a261", fontSize: "0.9rem", background: "#2a1a0e", padding: "0.5rem 1rem", borderRadius: "8px" }}>{status}</p>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.8rem" }}>
              <button onClick={playLesson} aria-label="L — Lesson सुनें" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#7c3aed", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
  {lang.listenBtn}<br /><span style={{ fontSize: "0.75rem" }}>(L)</span>
</button>
              <button onClick={() => speak(lastMessage)} aria-label="R — दोबारा सुनें" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#4a4af4", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                🔁 दोबारा<br /><span style={{ fontSize: "0.75rem" }}>(R)</span>
              </button>
              <button onClick={startListening} disabled={listening} aria-label="T — आवाज़ से जवाब दें" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: listening ? "#333" : "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                {listening ? "🎙️ सुन रही हूँ" : "🎤 बोलें"}<br /><span style={{ fontSize: "0.75rem" }}>(T)</span>
              </button>
              <button onClick={step === "done" ? () => navigate("/mcq", { state: { name, language, instructionLang } }) : nextLesson} aria-label="N — अगला lesson" style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", borderRadius: "12px", background: "#22c55e", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                {step === "done" ? "✅ MCQ" : "अगला →"}<br /><span style={{ fontSize: "0.75rem" }}>(N)</span>
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
                {[["L", "Lesson सुनें"], ["R", "दोबारा सुनें"], ["T", "आवाज़ से जवाब"], ["N", "अगला lesson"], ["M", "Theme बदलें"], ["1", "Lessons page"], ["2", "MCQ page"], ["3", "Agent page"]].map(([key, desc]) => (
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

export default LessonsPage