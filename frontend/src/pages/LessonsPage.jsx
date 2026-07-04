import { t } from "../components/translations"
import { useNavigate, useLocation } from "react-router-dom"
import ProgressBar from "../components/ProgressBar"
import LessonSidebar from "../components/LessonSidebar"
import Navbar from "../components/Navbar"
import { useTheme } from "../components/useTheme"
import { postProgressUpdate } from "../components/offlineSync"
import { useState, useEffect, useRef } from "react"

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

const pythonLessonsMarathi = [
  { id: 1, title: "Python म्हणजे काय?", content: "Python ही एक programming language आहे. सोप्या भाषेत सांगायचे तर — Python हा एक मार्ग आहे ज्याने आपण computer ला सूचना देतो. जसे आपण एखाद्या माणसाशी मराठीत बोलतो, तसेच आपण computer शी Python मध्ये बोलतो. Python 1991 साली Guido van Rossum नावाच्या एका शास्त्रज्ञाने बनवली होती. Python खास आहे कारण ती वाचायला आणि समजायला खूप सोपी आहे. Python सारखी दिसते ती जवळजवळ इंग्रजी भाषेसारखीच असते. Python वापरून आपण websites बनवू शकतो, games बनवू शकतो, Artificial Intelligence बनवू शकतो, आणि data analysis करू शकतो. जगातील मोठ्या companies जसे Google, Netflix, आणि Instagram देखील Python वापरतात. Python ही beginners साठी सर्वात चांगली programming language आहे कारण तिचे rules खूप सोपे आहेत. आपण या course मध्ये Python शिकणार आहोत आणि स्वतःचे programs बनवणार आहोत.", example: null },
  { id: 2, title: "print() function", content: "print() function हे Python मधील सर्वात पहिले आणि सर्वात महत्त्वाचे function आहे. print चा अर्थ आहे — screen वर काहीतरी दाखवणे. आपण print च्या brackets च्या आत जे काही लिहितो ते computer च्या screen वर दिसते. उदाहरणार्थ जर आपण print नमस्कार लिहिले तर screen वर नमस्कार दिसेल. Text लिहिताना त्याला quotes च्या आत लिहणे आवश्यक आहे. आपण numbers देखील print करू शकतो आणि एकाच वेळी दोन गोष्टी एकत्र print करू शकतो. print() function मध्ये comma वापरून अनेक गोष्टी एका ओळीत print करता येतात. प्रत्येक Python programmer रोज print() function वापरतो. हे function debugging साठी देखील खूप उपयुक्त आहे म्हणजे program मध्ये काय चालू आहे हे तपासण्यासाठी.", example: 'print("नमस्कार जग!")\nprint(42)\nprint("माझे नाव", "Pyra", "आहे")\nprint("आज", 2024, "साल आहे")' },
  { id: 3, title: "Variables", content: "Variable ला आपण एक डबा किंवा खोकं समजू शकतो. जसे घरात वेगवेगळ्या डब्यांमध्ये साखर, मीठ, आणि तांदूळ ठेवतो, तसेच computer मध्ये वेगवेगळ्या variables मध्ये वेगवेगळा data ठेवतो. प्रत्येक variable ला एक नाव असते. त्या नावाने आपण तो data नंतर वापरू शकतो. उदाहरणार्थ naam नावाच्या variable मध्ये Sharada ठेवले, तर जेव्हाही naam लिहू तेव्हा Sharada मिळेल. Variable बनवण्यासाठी आधी नाव लिहा, मग equal sign, मग value. Variable चे नाव नेहमी लहान अक्षरांमध्ये लिहतात आणि मध्ये space नसते. जर नावात दोन शब्द असतील तर underscore वापरतात जसे my_name. Variable ची value नंतर बदलता येते. एकदा variable बनवला की तो program संपेपर्यंत आपल्याला वापरता येतो.", example: 'naam = "Sharada"\nvay = 20\nshahar = "Pune"\nprint(naam)\nprint(vay)\nprint(shahar)' },
  { id: 4, title: "Data Types", content: "Python मध्ये वेगवेगळ्या प्रकारचा data असतो ज्यांना Data Types म्हणतात. पहिला आहे int म्हणजे पूर्ण संख्या जसे 5, 10, 100, 1000. दुसरा आहे float म्हणजे दशांश संख्या जसे 3.14, 5.5, 9.99. तिसरा आहे string म्हणजे text जसे नमस्कार, Sharada, Pune. string नेहमी quotes च्या आत लिहतात. चौथा आहे bool ज्यामध्ये फक्त दोन values असतात — True किंवा False. उदाहरणार्थ आज पाऊस आहे का? True किंवा False. Python स्वतः समजते की कोणता data type आहे. आपल्याला वेगळे सांगायची गरज नाही. हे Python ची सर्वात चांगली खासियत आहे. type() function वापरून आपण कोणत्याही variable चा data type तपासू शकतो.", example: 'vay = 20\nunchaai = 5.6\nnaam = "Pyra"\nkya_vidyarthi_ahe = True\nprint(vay)\nprint(unchaai)\nprint(naam)\nprint(kya_vidyarthi_ahe)\nprint(type(vay))\nprint(type(naam))' },
  { id: 5, title: "User कडून Input घेणे", content: "आतापर्यंत आपण स्वतःच data लिहिला. पण real programs मध्ये user कडून data घ्यावा लागतो. यासाठी Python मध्ये input() function आहे. input() function screen वर एक प्रश्न दाखवतो आणि user चे उत्तर ऐकतो. user जे काही type करतो ते एका variable मध्ये save होते. उदाहरणार्थ जर आपण विचारले तुमचे नाव काय आहे, तर user जे नाव type करेल ते naam variable मध्ये save होईल. मग आपण तो naam print करू शकतो. हे खूप महत्त्वाचे आहे कारण प्रत्येक app मध्ये user कडून काही ना काही घ्यावे लागते. एक महत्त्वाची गोष्ट — input() function नेहमी string देते. जर आपल्याला number हवे असेल तर int() किंवा float() वापरून convert करावे लागते.", example: 'naam = input("तुमचे नाव काय आहे? ")\nvay = int(input("तुमचे वय किती आहे? "))\nprint("नमस्कार", naam)\nprint("तुमचे वय आहे", vay)\nprint("10 वर्षांनी तुम्ही", vay + 10, "वर्षांचे असाल")' },
  { id: 6, title: "If/Else Conditions", content: "If/Else ने आपण computer ला निर्णय घेण्यास शिकवतो. जसे आपण विचार करतो — जर पाऊस असेल तर छत्री घे, नाहीतर उन्हाचा चष्मा घे. तसेच Python मध्ये if लिहून condition लिहतो. जर condition बरोबर असेल तर if वाला code चालतो. जर condition चुकीची असेल तर else वाला code चालतो. Condition मध्ये आपण greater than, less than, equal to असे operators वापरतो. if च्या नंतर colon लावणे आवश्यक आहे आणि पुढच्या ओळीत 4 spaces चे indentation देणे आवश्यक आहे. elif वापरून अनेक conditions तपासता येतात. elif म्हणजे else if. आपण एकाच वेळी if, elif, आणि else एकत्र वापरू शकतो. हे Python चा खूप महत्त्वाचा concept आहे.",example: 'vay = 18\nif vay >= 18:\n    print("तुम्ही मतदान करू शकता")\nelse:\n    print("तुम्ही मतदान करू शकत नाही")\n\nmarks = 75\nif marks >= 90:\n    print("Grade: A")\nelif marks >= 75:\n    print("Grade: B")\nelif marks >= 60:\n    print("Grade: C")\nelse:\n    print("Grade: F")' },
  { id: 7, title: "For Loop", content: "For loop ने आपण एखादे काम अनेक वेळा करवू शकतो. जर आपल्याला 1 ते 100 पर्यंत मोजायचे असेल तर काय आपण 100 वेळा print लिहणार? नाही! यासाठी for loop वापरतो. for loop मध्ये range() function वापरतात. range(1, 6) चा अर्थ आहे 1 ते 5 पर्यंत. प्रत्येक वेळी loop चालल्यावर i ची value बदलते. पहिल्यांदा i=1, दुसऱ्यांदा i=2, आणि असे पुढे जाते. for loop चा उपयोग list च्या प्रत्येक item वर काम करण्यासाठी देखील होतो. range() मध्ये तिसरा parameter step असतो. जसे range(0, 10, 2) म्हणजे 0, 2, 4, 6, 8 — दोन दोन करून. Loops हे programming चे सर्वात महत्त्वाचे concept आहे.", example: "for i in range(1, 6):\n    print(i)\n\nfor i in range(1, 11):\n    print(i, 'चा square आहे', i*i)\n\nfor i in range(10, 0, -1):\n    print(i, '...')\nprint('सुरुवात!')" },
  { id: 8, title: "While Loop", content: "While loop तोपर्यंत चालतो जोपर्यंत एखादी condition बरोबर असते. जसे — जोपर्यंत पाणी मिळत नाही तोपर्यंत चालत राहा. हे for loop पेक्षा वेगळे आहे. for loop मध्ये आपल्याला आधीच माहीत असते की किती वेळा चालेल. while loop मध्ये condition वर अवलंबून असते. while loop बद्दल एक गोष्ट खूप महत्त्वाची आहे — loop च्या आत असे काहीतरी असायला हवे जे condition ला eventually false करेल. नाहीतर loop नेहमी चालत राहील ज्याला infinite loop म्हणतात. count = count + 1 म्हणूनच लिहतो जेणेकरून loop बंद होईल. while loop password check करण्यासाठी, game मध्ये, आणि user input घेण्यासाठी खूप उपयुक्त आहे.", example: "count = 1\nwhile count <= 5:\n    print(count)\n    count = count + 1\n\npassword = ''\nwhile password != 'hello':\n    password = input('Password टाका: ')\nprint('बरोबर password!')"},
  { id: 9, title: "Lists", content: "List एखाद्या पिशवीसारखी आहे ज्यात आपण अनेक गोष्टी एकत्र ठेवू शकतो. जसे एका पिशवीत सफरचंद, केळे, आणि आंबा ठेवतो, तसेच list मध्ये अनेक values ठेवता येतात. List square brackets मध्ये लिहतात आणि items ला comma ने वेगळे करतात. List मधील प्रत्येक item ला एक number असतो ज्याला index म्हणतात. Index नेहमी 0 पासून सुरू होतो. म्हणजे पहिला item index 0 वर आहे, दुसरा index 1 वर. len() function ने list मध्ये किती items आहेत हे कळते. append() ने नवीन item add करता येतो. remove() ने item हटवता येतो. List मधील कोणताही item बदलता येतो. Lists हे Python मधील सर्वात उपयुक्त data structure आहे.", example: 'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])\nprint(fruits[1])\nprint(len(fruits))\nfruits.append("orange")\nprint(fruits)\nfruits.remove("banana")\nprint(fruits)' },
  { id: 10, title: "Functions", content: "Function हा एक छोटा program असतो जो एक specific काम करतो. Function चा सर्वात मोठा फायदा म्हणजे एकदा लिहा आणि अनेक वेळा वापरा. जसे TV चा remote एक function आहे — तो एकदा बनवला आणि अनेक वेळा वापरतो. def keyword ने function बनवतात. def च्या नंतर function चे नाव लिहतात, मग brackets मध्ये parameters. Parameters म्हणजे त्या values ज्या आपण function ला देतो. Function च्या आत चा code तेव्हा चालतो जेव्हा आपण function ला call करतो. Function call करण्यासाठी function चे नाव आणि brackets लिहतात. return keyword वापरून function एखादे value परत देऊ शकते. Functions मुळे code neat आणि reusable होतो.", example: 'def namaskaar(naam):\n    print("नमस्कार", naam, "जी!")\n\ndef add(a, b):\n    result = a + b\n    return result\n\nnamaskaar("Sharada")\nnamaskaar("Pyra")\nans = add(5, 3)\nprint("5 + 3 =", ans)\nprint("10 + 20 =", add(10, 20))' },
  { id: 11, title: "String Operations", content: "String म्हणजे text. String सोबत आपण खूप काही करू शकतो. दोन strings जोडण्यासाठी plus operator वापरतो. upper() ने सर्व अक्षरे मोठी होतात. lower() ने सर्व अक्षरे लहान होतात. len() ने string मध्ये किती characters आहेत हे कळते. replace() ने एखादा शब्द बदलता येतो. split() ने string चे parts करता येतात. in keyword ने check करता येते की एखादा शब्द string मध्ये आहे की नाही. strip() ने string च्या सुरुवातीचे आणि शेवटचे spaces हटवता येतात. String operations खूप उपयुक्त आहेत कारण real programs मध्ये text सोबत खूप काम करावे लागते. Forms, messages, files — सगळीकडे strings असतात.", example: 'naam = "sharada"\nprint(naam.upper())\nprint(naam.lower())\nprint(len(naam))\nprint("नमस्कार " + naam)\nprint(naam.replace("sharada", "pyra"))\nprint("sha" in naam)\nwords = "apple,banana,mango"\nprint(words.split(","))' },
  { id: 12, title: "Math Operations", content: "Python एक उत्तम calculator देखील आहे. बेरजेसाठी plus, वजाबाकीसाठी minus, गुणाकारासाठी star, भागाकारासाठी slash वापरतो. बाकी म्हणजे remainder साठी percent sign वापरतो. Double star ने power काढता येतो जसे 2 ची power 3 म्हणजे 8. Double slash ने floor division होतो जो भागाकारानंतर decimal हटवतो. Python मध्ये math module देखील असतो ज्याने square root, trigonometry सारख्या calculations करता येतात. import math लिहून हा module वापरता येतो. math.sqrt() ने square root, math.pi ने pi ची value मिळते. Calculator बनवण्यात हेच सर्व operations काम येतात.", example: "a = 10\nb = 3\nprint('बेरीज:', a + b)\nprint('वजाबाकी:', a - b)\nprint('गुणाकार:', a * b)\nprint('भागाकार:', a / b)\nprint('बाकी:', a % b)\nprint('घात:', 2 ** 10)\n\nimport math\nprint('Square root of 16:', math.sqrt(16))" },
  { id: 13, title: "Comments", content: "Comments म्हणजे त्या ओळी ज्या Python run करत नाही. Comments फक्त आपल्या developers साठी असतात — code समजावून सांगण्यासाठी. जसे पुस्तकात notes लिहतो, तसेच code मध्ये comments लिहतो. Hash symbol म्हणजे # ने single line comment बनवतो. # च्या नंतर जे काही लिहाल ते Python ignore करते. Comments लिहणे खूप महत्त्वाचे आहे कारण नंतर जेव्हा आपण आपला code दुबारा वाचू किंवा दुसरा कोणी वाचेल तर समजेल. चांगले programmers नेहमी comments लिहतात. Comments मुळे team work करणे सोपे होते. एक professional programmer म्हणून comments लिहणे ही सवय लावून घ्या.", example: "# हे एक simple calculator आहे\na = 10  # पहिला number\nb = 5   # दुसरा number\n\n# बेरीज करतो\nresult = a + b\nprint('बेरीज:', result)  # result print करा\n\n# हे program Sharada ने लिहिले आहे" },
  { id: 14, title: "Error Handling", content: "जेव्हा Python ला एखादी चूक सापडते तेव्हा program बंद होतो. पण real apps मध्ये आपल्याला program बंद व्हायला नको असतो. यासाठी try आणि except वापरतो. try च्या आत तो code लिहतो ज्यात error येऊ शकते. जर error आली तर except वाला code चालतो आणि program बंद होत नाही. उदाहरणार्थ जर आपण एखाद्या number ला zero ने divide केले तर error येते. try आणि except ने ती error पकडून user ला एक चांगला message देऊ शकतो. ZeroDivisionError म्हणजे zero ने divide केल्याची error. ValueError म्हणजे चुकीच्या type ची value दिली तेव्हा येणारी error. finally block नेहमी चालतो मग error असो किंवा नसो. हे professional programming चा खूप महत्त्वाचा भाग आहे.", example: "try:\n    result = 10 / 0\n    print(result)\nexcept ZeroDivisionError:\n    print('चूक! शून्याने भाग होत नाही')\n\ntry:\n    number = int('hello')\nexcept ValueError:\n    print('चूक! हे number नाही')\nfinally:\n    print('Program चालू आहे')" },
  { id: 15, title: "Mini Project — Calculator", content: "शाब्बास! तुम्ही Python चे सर्व basic concepts शिकलात. आता आपण हे सर्व एकत्र करून एक real calculator बनवूया. या calculator मध्ये आपण functions वापरू, if/else conditions वापरू, आणि variables वापरू. हे तुमचे पहिले Python project आहे. हे बनवल्यावर तुम्ही म्हणू शकता की मी Python मध्ये एक program बनवला आहे. हा calculator दोन numbers घेतो, operation विचारतो, आणि result देतो. या project मध्ये आपण शिकलेल्या सर्व गोष्टी एकत्र आल्या आहेत — variables, functions, if/elif/else, आणि return. पुढे जाऊन तुम्ही हा calculator आणखी चांगला बनवू शकता जसे की history ठेवणे किंवा square root add करणे.", example: 'def calculator(a, b, operation):\n    if operation == "+":\n        return a + b\n    elif operation == "-":\n        return a - b\n    elif operation == "*":\n        return a * b\n    elif operation == "/":\n        if b != 0:\n            return a / b\n        else:\n            return "शून्याने भाग होत नाही"\n    else:\n        return "चुकीचे operation"\n\nprint(calculator(10, 5, "+"))\nprint(calculator(10, 5, "-"))\nprint(calculator(10, 5, "*"))\nprint(calculator(10, 5, "/"))' },
]

const sqlLessons = [
  { id: 1, title: "SQL क्या है?", content: "SQL का पूरा नाम है Structured Query Language। SQL एक special language है जिससे हम database के साथ बात करते हैं। Database एक जगह है जहाँ बहुत सारा data store होता है। जैसे school में एक register होता है जिसमें सभी students के नाम, उम्र, और marks लिखे होते हैं — वैसे ही computer में database होता है। SQL से हम उस database से data निकाल सकते हैं, नया data डाल सकते हैं, पुराना data बदल सकते हैं, और data हटा सकते हैं। SQL 1970 के दशक में बनाई गई थी और आज भी दुनिया की हर बड़ी company इसे use करती है। हर app जैसे WhatsApp, Instagram, और Amazon के पीछे एक database होता है और उसे SQL से manage किया जाता है। SQL सीखना हर programmer के लिए बहुत जरूरी है।", example: null },
  { id: 2, title: "SELECT Statement", content: "SELECT statement SQL का सबसे जरूरी और सबसे ज्यादा use होने वाला command है। SELECT का मतलब है — database की table से data निकालना या देखना। जैसे हम library में जाकर कहते हैं मुझे सभी किताबें दिखाओ, वैसे ही SELECT से हम table का सारा data देख सकते हैं। Star symbol यानी asterisk का मतलब है सभी columns। FROM के बाद table का नाम लिखते हैं। अगर हमें सिर्फ कुछ specific columns चाहिए तो star की जगह column के नाम लिखते हैं। SELECT एक non-destructive command है यानी इससे data सिर्फ दिखता है, बदलता या हटता नहीं। यह सबसे safe command है।", example: "-- सभी data देखें\nSELECT * FROM students;\n\n-- सिर्फ नाम और उम्र देखें\nSELECT name, age FROM students;\n\n-- सिर्फ नाम देखें\nSELECT name FROM students;" },
  { id: 3, title: "WHERE Clause", content: "WHERE clause से हम condition लगाकर specific data निकालते हैं। जैसे अगर हमें सिर्फ 18 साल से बड़े students चाहिए, तो WHERE से वो filter कर सकते हैं। WHERE हमेशा SELECT के बाद और table के नाम के बाद लिखते हैं। WHERE में हम greater than, less than, equal to, not equal to जैसे operators use करते हैं। Text values को quotes के अंदर लिखते हैं। WHERE में AND और OR से एक साथ कई conditions लगा सकते हैं। AND का मतलब है दोनों conditions सच हों। OR का मतलब है कोई एक condition सच हो। WHERE clause बहुत powerful है और real projects में हर query में use होता है।", example: "-- उम्र 18 से ज्यादा वाले students\nSELECT * FROM students\nWHERE age > 18;\n\n-- Mumbai के students\nSELECT * FROM students\nWHERE city = 'Mumbai';\n\n-- Mumbai के 18+ students\nSELECT * FROM students\nWHERE city = 'Mumbai' AND age > 18;" },
  { id: 4, title: "INSERT Statement", content: "INSERT statement से हम database की table में नया data डालते हैं। जैसे school register में नए student का नाम लिखते हैं, वैसे ही INSERT से नया record add करते हैं। INSERT INTO के बाद table का नाम लिखते हैं। फिर brackets में वो columns लिखते हैं जिनमें data डालना है। VALUES के बाद brackets में actual values लिखते हैं। Columns और values का order एक जैसा होना चाहिए। Text values को single quotes में लिखते हैं। Numbers को quotes की जरूरत नहीं। एक बार में एक या एक साथ कई records insert किए जा सकते हैं। INSERT करने के बाद वो data permanently table में save हो जाता है।", example: "-- एक नया student add करें\nINSERT INTO students (name, age, city)\nVALUES ('Sharada', 20, 'Mumbai');\n\n-- एक साथ कई students add करें\nINSERT INTO students (name, age, city)\nVALUES ('Rahul', 22, 'Delhi'),\n       ('Priya', 19, 'Pune'),\n       ('Amit', 21, 'Chennai');" },
  { id: 5, title: "UPDATE Statement", content: "UPDATE statement से हम table में पहले से मौजूद data को बदलते हैं। जैसे किसी student का address बदल गया, तो हम उसे update करते हैं। UPDATE के बाद table का नाम लिखते हैं। SET के बाद column का नाम और नई value लिखते हैं। WHERE clause लगाना बहुत जरूरी है — अगर WHERE नहीं लगाया तो table के सभी rows update हो जाएंगे जो बहुत बड़ी गलती है। WHERE से हम specify करते हैं कि कौन सी row update होनी चाहिए। SET में comma से multiple columns एक साथ update किए जा सकते हैं। UPDATE एक destructive operation है इसलिए हमेशा सोच-समझकर use करें।", example: "-- Sharada की उम्र update करें\nUPDATE students\nSET age = 21\nWHERE name = 'Sharada';\n\n-- एक साथ दो चीज़ें update करें\nUPDATE students\nSET age = 21, city = 'Pune'\nWHERE name = 'Sharada';" },
  { id: 6, title: "DELETE Statement", content: "DELETE statement से हम table से data हटाते हैं। जैसे school register से किसी student का नाम काटते हैं, वैसे ही DELETE से record हटाते हैं। DELETE FROM के बाद table का नाम लिखते हैं। UPDATE की तरह यहाँ भी WHERE clause लगाना बहुत जरूरी है। अगर WHERE नहीं लगाया तो table के सभी records delete हो जाएंगे — यह बहुत बड़ी गलती है और data वापस नहीं आएगा। WHERE से हम specify करते हैं कि कौन सा record delete होना चाहिए। DELETE करने से पहले हमेशा एक बार SELECT करके देख लो कि कौन सा data delete होगा। DELETE permanent है — एक बार delete हुआ data वापस नहीं आता।", example: "-- पहले check करो कि क्या delete होगा\nSELECT * FROM students\nWHERE name = 'Sharada';\n\n-- फिर delete करो\nDELETE FROM students\nWHERE name = 'Sharada';\n\n-- सभी records delete (खतरनाक!)\n-- DELETE FROM students;" },
  { id: 7, title: "CREATE TABLE", content: "CREATE TABLE से हम database में नई table बनाते हैं। Table एक spreadsheet की तरह होती है जिसमें rows और columns होते हैं। CREATE TABLE के बाद table का नाम लिखते हैं। फिर brackets के अंदर सभी columns के नाम और उनके data types लिखते हैं। INT का मतलब पूरी संख्या। VARCHAR का मतलब text और brackets में maximum length लिखते हैं। DATE का मतलब तारीख। PRIMARY KEY वो column होता है जो हर row को unique identify करता है जैसे id। NOT NULL का मतलब है कि यह column खाली नहीं रह सकता। Table बनाने के बाद उसमें INSERT से data डाल सकते हैं।", example: "CREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL,\n  age INT,\n  city VARCHAR(50),\n  marks FLOAT\n);\n\n-- Table देखें\nSELECT * FROM students;" },
  { id: 8, title: "ORDER BY", content: "ORDER BY से हम query के result को sort करते हैं। जैसे हम students को उनके marks के हिसाब से ऊपर से नीचे लगाना चाहते हैं, वो ORDER BY से होता है। ORDER BY हमेशा query के अंत में लिखते हैं। ASC का मतलब है ascending order यानी छोटे से बड़े की तरफ। DESC का मतलब है descending order यानी बड़े से छोटे की तरफ। Default ORDER BY ASC होता है। एक से ज्यादा columns से भी sort कर सकते हैं — पहले एक column से फिर दूसरे से। ORDER BY text columns पर भी काम करता है — alphabetically sort होता है।", example: "-- उम्र के हिसाब से छोटे से बड़े\nSELECT * FROM students\nORDER BY age ASC;\n\n-- marks के हिसाब से बड़े से छोटे\nSELECT * FROM students\nORDER BY marks DESC;\n\n-- नाम alphabetically\nSELECT * FROM students\nORDER BY name ASC;" },
  { id: 9, title: "COUNT, SUM, AVG Functions", content: "SQL में कुछ special functions होते हैं जिन्हें Aggregate Functions कहते हैं। ये functions पूरी table पर काम करते हैं और एक result देते हैं। COUNT() से rows की संख्या निकालते हैं। SUM() से किसी column के सभी numbers का जोड़ निकालते हैं। AVG() से average निकालते हैं। MAX() से सबसे बड़ी value निकालते हैं। MIN() से सबसे छोटी value निकालते हैं। ये functions WHERE के साथ भी use हो सकते हैं। जैसे सिर्फ Mumbai के students की average age निकालनी हो। AS keyword से result को एक नाम दे सकते हैं जिसे alias कहते हैं।", example: "-- कुल कितने students हैं\nSELECT COUNT(*) AS total_students\nFROM students;\n\n-- सभी की average age\nSELECT AVG(age) AS average_age\nFROM students;\n\n-- सबसे ज्यादा marks\nSELECT MAX(marks) AS highest_marks\nFROM students;" },
  { id: 10, title: "JOIN — दो Tables जोड़ना", content: "JOIN से हम दो या उससे ज्यादा tables का data एक साथ निकालते हैं। Real databases में data अलग-अलग tables में रखा जाता है। जैसे एक table में students की जानकारी और दूसरी table में उनके marks। JOIN से हम दोनों tables को जोड़कर एक साथ देख सकते हैं। INNER JOIN सबसे common join है — यह दोनों tables में matching records दिखाता है। JOIN करने के लिए दोनों tables में एक common column होना चाहिए जैसे student_id। ON keyword के बाद वो common column लिखते हैं। JOIN एक बहुत powerful feature है जो real projects में हर जगह use होता है।", example: "-- students और marks tables join करें\nSELECT students.name, students.city, marks.score\nFROM students\nINNER JOIN marks\nON students.id = marks.student_id;\n\n-- WHERE के साथ join\nSELECT students.name, marks.score\nFROM students\nINNER JOIN marks ON students.id = marks.student_id\nWHERE marks.score > 80;" },
]

const sqlLessonsEnglish = [
  { 
    id: 1, 
    title: "What is SQL?", 
    content: "SQL stands for Structured Query Language. SQL is a special language that we use to communicate with a database. A database is a place where a large amount of data is stored. Think of it like a school register that contains the names, ages, and marks of all students — a database is like that but stored on a computer. Using SQL we can retrieve data from a database, insert new data, update existing data, and delete data. SQL was created in the 1970s and even today every major company in the world uses it. Every app like WhatsApp, Instagram, and Amazon has a database behind it and SQL is used to manage that database. Learning SQL is essential for every programmer.", example: null },
  { 
    id: 2, 
    title: "SELECT Statement", 
    content: "The SELECT statement is the most important and most frequently used command in SQL. SELECT means retrieving or viewing data from a table in the database. Just like going to a library and saying show me all the books, SELECT lets us see all the data in a table. The star symbol also called asterisk means all columns. After FROM we write the name of the table. If we only need specific columns we write the column names instead of the star. SELECT is a non-destructive command which means it only shows the data without changing or deleting anything. It is the safest SQL command to use.", example: "-- View all data\nSELECT * FROM students;\n\n-- View only name and age\nSELECT name, age FROM students;\n\n-- View only names\nSELECT name FROM students;" },
  { 
    id: 3, 
    title: "WHERE Clause", 
    content: "The WHERE clause lets us filter data by applying a condition. For example if we only want students who are older than 18 we can filter them using WHERE. WHERE is always written after SELECT and after the table name. In WHERE we use operators like greater than, less than, equal to, and not equal to. Text values are written inside single quotes. We can apply multiple conditions at once using AND and OR with WHERE. AND means both conditions must be true. OR means at least one condition must be true. The WHERE clause is very powerful and is used in almost every query in real projects.", example: "-- Students older than 18\nSELECT * FROM students\nWHERE age > 18;\n\n-- Students from Mumbai\nSELECT * FROM students\nWHERE city = 'Mumbai';\n\n-- Students from Mumbai AND older than 18\nSELECT * FROM students\nWHERE city = 'Mumbai' AND age > 18;" },
  { 
    id: 4, 
    title: "INSERT Statement", 
    content: "The INSERT statement is used to add new data into a table in the database. Just like writing a new student's name in a school register, INSERT adds a new record to the table. After INSERT INTO we write the table name. Then inside brackets we write the column names where we want to insert data. After VALUES we write the actual values inside brackets. The order of columns and values must match. Text values are written inside single quotes. Numbers do not need quotes. We can insert one record or multiple records at once. Once inserted the data is permanently saved in the table.", example: "-- Add one new student\nINSERT INTO students (name, age, city)\nVALUES ('Sharada', 20, 'Mumbai');\n\n-- Add multiple students at once\nINSERT INTO students (name, age, city)\nVALUES ('Rahul', 22, 'Delhi'),\n       ('Priya', 19, 'Pune'),\n       ('Amit', 21, 'Chennai');" },
  { 
    id: 5, 
    title: "UPDATE Statement", 
    content: "The UPDATE statement is used to change existing data in a table. For example if a student's address has changed we update it using UPDATE. After UPDATE we write the table name. After SET we write the column name and the new value. Using the WHERE clause is very important here — if we do not use WHERE then all rows in the table will be updated which is a very serious mistake. WHERE tells SQL which specific row should be updated. We can update multiple columns at once by separating them with commas in the SET clause. UPDATE is a destructive operation so always use it carefully.", example: "-- Update Sharada's age\nUPDATE students\nSET age = 21\nWHERE name = 'Sharada';\n\n-- Update two things at once\nUPDATE students\nSET age = 21, city = 'Pune'\nWHERE name = 'Sharada';" },
  { 
    id: 6, 
    title: "DELETE Statement", 
    content: "The DELETE statement is used to remove data from a table. Just like crossing out a student's name from a school register, DELETE removes a record. After DELETE FROM we write the table name. Just like UPDATE the WHERE clause is extremely important here. If we do not use WHERE then all records in the table will be deleted — this is a very serious mistake and the data cannot be recovered. WHERE tells SQL exactly which record should be deleted. Before running DELETE always run a SELECT first to verify which data will be deleted. DELETE is permanent — once deleted the data cannot be recovered.", example: "-- First check what will be deleted\nSELECT * FROM students\nWHERE name = 'Sharada';\n\n-- Then delete\nDELETE FROM students\nWHERE name = 'Sharada';\n\n-- Delete all records (DANGEROUS!)\n-- DELETE FROM students;" },
  { 
    id: 7, 
    title: "CREATE TABLE", 
    content: "CREATE TABLE is used to create a new table in the database. A table is like a spreadsheet with rows and columns. After CREATE TABLE we write the table name. Then inside brackets we write all the column names and their data types. INT means a whole number. VARCHAR means text and we write the maximum length inside brackets. DATE means a date value. PRIMARY KEY is the column that uniquely identifies each row such as an id column. NOT NULL means that column cannot be left empty. After creating the table we can use INSERT to add data into it.", example: "CREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL,\n  age INT,\n  city VARCHAR(50),\n  marks FLOAT\n);\n\n-- View the table\nSELECT * FROM students;" },
  { 
    id: 8, 
    title: "ORDER BY", 
    content: "ORDER BY is used to sort the results of a query. For example if we want to arrange students from highest to lowest marks we use ORDER BY. ORDER BY is always written at the end of a query. ASC means ascending order which goes from smallest to largest. DESC means descending order which goes from largest to smallest. The default order of ORDER BY is ASC. We can sort by more than one column — first by one column and then by another. ORDER BY also works on text columns and sorts them alphabetically.", example: "-- Sort by age from youngest to oldest\nSELECT * FROM students\nORDER BY age ASC;\n\n-- Sort by marks from highest to lowest\nSELECT * FROM students\nORDER BY marks DESC;\n\n-- Sort by name alphabetically\nSELECT * FROM students\nORDER BY name ASC;" },
  { 
    id: 9, 
    title: "COUNT, SUM, AVG Functions", 
    content: "SQL has special functions called Aggregate Functions. These functions work on an entire table and return a single result. COUNT() counts the number of rows. SUM() adds up all the numbers in a column. AVG() calculates the average value. MAX() finds the largest value. MIN() finds the smallest value. These functions can also be used together with WHERE to filter before calculating. For example finding the average age of only students from Mumbai. The AS keyword gives a name to the result which is called an alias. Aggregate functions are used in almost every real-world database application.", example: "-- Total number of students\nSELECT COUNT(*) AS total_students\nFROM students;\n\n-- Average age of all students\nSELECT AVG(age) AS average_age\nFROM students;\n\n-- Highest marks in the class\nSELECT MAX(marks) AS highest_marks\nFROM students;" },
  { 
    id: 10, 
    title: "JOIN — Combining Two Tables", 
    content: "JOIN is used to retrieve data from two or more tables at the same time. In real databases data is kept in separate tables. For example one table has student information and another table has their marks. JOIN lets us combine both tables and view the data together. INNER JOIN is the most common type of join — it shows only the records that have a match in both tables. To use JOIN both tables must have a common column such as student_id. After the ON keyword we write that common column. JOIN is a very powerful feature that is used everywhere in real projects.", example: "-- Join students and marks tables\nSELECT students.name, students.city, marks.score\nFROM students\nINNER JOIN marks\nON students.id = marks.student_id;\n\n-- Join with WHERE filter\nSELECT students.name, marks.score\nFROM students\nINNER JOIN marks ON students.id = marks.student_id\nWHERE marks.score > 80;" },
]

const sqlLessonsMarathi = [
  { id: 1, title: "SQL म्हणजे काय?", content: "SQL चे पूर्ण नाव आहे Structured Query Language. SQL ही एक special language आहे ज्याने आपण database शी बोलतो. Database म्हणजे एक जागा जिथे खूप सारा data store होतो. जसे शाळेत एक register असते ज्यात सर्व students चे नाव, वय, आणि marks लिहिलेले असतात — तसेच computer मध्ये database असतो. SQL ने आपण त्या database मधून data काढू शकतो, नवीन data टाकू शकतो, जुना data बदलू शकतो, आणि data हटवू शकतो. SQL 1970 च्या दशकात बनवली गेली होती आणि आजही जगातील प्रत्येक मोठी company ती वापरते. WhatsApp, Instagram, आणि Amazon सारख्या प्रत्येक app च्या मागे एक database असतो आणि त्याला SQL ने manage केले जाते. SQL शिकणे प्रत्येक programmer साठी खूप आवश्यक आहे.", example: null },
  { id: 2, title: "SELECT Statement", content: "SELECT statement हे SQL मधील सर्वात महत्त्वाचे आणि सर्वाधिक वापरले जाणारे command आहे. SELECT चा अर्थ आहे — database च्या table मधून data काढणे किंवा पाहणे. जसे आपण library मध्ये जाऊन म्हणतो मला सर्व पुस्तके दाखवा, तसेच SELECT ने आपण table चा सर्व data पाहू शकतो. Star symbol म्हणजे asterisk चा अर्थ आहे सर्व columns. FROM च्या नंतर table चे नाव लिहतो. जर आपल्याला फक्त काही specific columns हवे असतील तर star च्या जागी column चे नाव लिहतो. SELECT हे non-destructive command आहे म्हणजे यातून data फक्त दिसतो, बदलत किंवा हटत नाही. हे सर्वात safe command आहे.", example: "-- सर्व data पाहा\nSELECT * FROM students;\n\n-- फक्त नाव आणि वय पाहा\nSELECT name, age FROM students;\n\n-- फक्त नावे पाहा\nSELECT name FROM students;" },
  { id: 3, title: "WHERE Clause", content: "WHERE clause ने आपण condition लावून specific data काढतो. उदाहरणार्थ जर आपल्याला फक्त 18 वर्षांपेक्षा मोठे students हवे असतील तर WHERE ने ते filter करता येतात. WHERE नेहमी SELECT च्या नंतर आणि table च्या नावाच्या नंतर लिहतो. WHERE मध्ये आपण greater than, less than, equal to, not equal to असे operators वापरतो. Text values single quotes मध्ये लिहतो. WHERE सोबत AND आणि OR वापरून एकत्र अनेक conditions लावता येतात. AND चा अर्थ आहे दोन्ही conditions बरोबर असाव्यात. OR चा अर्थ आहे कोणतीही एक condition बरोबर असावी. WHERE clause खूप powerful आहे आणि real projects मध्ये प्रत्येक query मध्ये वापरले जाते.", example: "-- 18 पेक्षा मोठे students\nSELECT * FROM students\nWHERE age > 18;\n\n-- Pune चे students\nSELECT * FROM students\nWHERE city = 'Pune';\n\n-- Pune चे आणि 18+ students\nSELECT * FROM students\nWHERE city = 'Pune' AND age > 18;" },
  { id: 4, title: "INSERT Statement", content: "INSERT statement ने आपण database च्या table मध्ये नवीन data टाकतो. जसे शाळेच्या register मध्ये नव्या student चे नाव लिहतो, तसेच INSERT ने नवीन record add करतो. INSERT INTO च्या नंतर table चे नाव लिहतो. मग brackets मध्ये ते columns लिहतो ज्यात data टाकायचा आहे. VALUES च्या नंतर brackets मध्ये actual values लिहतो. Columns आणि values चा order एकसारखा असायला हवा. Text values single quotes मध्ये लिहतो. Numbers ला quotes ची गरज नाही. एकावेळी एक किंवा एकत्र अनेक records insert करता येतात. INSERT केल्यानंतर तो data permanently table मध्ये save होतो.", example: "-- एक नवीन student add करा\nINSERT INTO students (name, age, city)\nVALUES ('Sharada', 20, 'Pune');\n\n-- एकत्र अनेक students add करा\nINSERT INTO students (name, age, city)\nVALUES ('Rahul', 22, 'Mumbai'),\n       ('Priya', 19, 'Nashik'),\n       ('Amit', 21, 'Nagpur');" },
  { id: 5, title: "UPDATE Statement", content: "UPDATE statement ने आपण table मधील आधीच असलेला data बदलतो. उदाहरणार्थ एखाद्या student चा address बदलला, तर आपण तो update करतो. UPDATE च्या नंतर table चे नाव लिहतो. SET च्या नंतर column चे नाव आणि नवीन value लिहतो. WHERE clause लावणे खूप महत्त्वाचे आहे — जर WHERE लावला नाही तर table च्या सर्व rows update होतील जी खूप मोठी चूक आहे. WHERE ने आपण specify करतो की कोणती row update व्हायला हवी. SET मध्ये comma ने multiple columns एकत्र update करता येतात. UPDATE हे destructive operation आहे म्हणून नेहमी विचारपूर्वक वापरा.", example: "-- Sharada चे वय update करा\nUPDATE students\nSET age = 21\nWHERE name = 'Sharada';\n\n-- एकत्र दोन गोष्टी update करा\nUPDATE students\nSET age = 21, city = 'Mumbai'\nWHERE name = 'Sharada';" },
  { id: 6, title: "DELETE Statement", content: "DELETE statement ने आपण table मधून data हटवतो. जसे शाळेच्या register मधून एखाद्या student चे नाव खोडतो, तसेच DELETE ने record हटवतो. DELETE FROM च्या नंतर table चे नाव लिहतो. UPDATE सारखेच इथेही WHERE clause लावणे अत्यंत आवश्यक आहे. जर WHERE लावला नाही तर table चे सर्व records delete होतील — ही खूप मोठी चूक आहे आणि data परत येणार नाही. WHERE ने आपण specify करतो की कोणता record delete व्हायला हवा. DELETE करण्यापूर्वी नेहमी आधी SELECT करून पाहा की कोणता data delete होणार आहे. DELETE permanent आहे — एकदा delete झालेला data परत येत नाही.", example: "-- आधी check करा काय delete होणार\nSELECT * FROM students\nWHERE name = 'Sharada';\n\n-- मग delete करा\nDELETE FROM students\nWHERE name = 'Sharada';\n\n-- सर्व records delete (धोकादायक!)\n-- DELETE FROM students;" },
  { id: 7, title: "CREATE TABLE", content: "CREATE TABLE ने आपण database मध्ये नवीन table बनवतो. Table म्हणजे एक spreadsheet सारखी असते ज्यात rows आणि columns असतात. CREATE TABLE च्या नंतर table चे नाव लिहतो. मग brackets च्या आत सर्व columns चे नाव आणि त्यांचे data types लिहतो. INT चा अर्थ पूर्ण संख्या. VARCHAR चा अर्थ text आणि brackets मध्ये maximum length लिहतो. DATE चा अर्थ तारीख. PRIMARY KEY तो column असतो जो प्रत्येक row ला uniquely identify करतो जसे id. NOT NULL चा अर्थ आहे की हा column रिकामा राहू शकत नाही. Table बनवल्यानंतर त्यात INSERT ने data टाकता येतो.", example: "CREATE TABLE students (\n  id INT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL,\n  age INT,\n  city VARCHAR(50),\n  marks FLOAT\n);\n\n-- Table पाहा\nSELECT * FROM students;" },
  { id: 8, title: "ORDER BY", content: "ORDER BY ने आपण query च्या result ला sort करतो. उदाहरणार्थ students ना त्यांच्या marks नुसार वरून खाली लावायचे असेल तर ORDER BY वापरतो. ORDER BY नेहमी query च्या शेवटी लिहतो. ASC चा अर्थ आहे ascending order म्हणजे लहानातून मोठ्याकडे. DESC चा अर्थ आहे descending order म्हणजे मोठ्यातून लहानाकडे. Default ORDER BY ASC असतो. एकापेक्षा जास्त columns नुसार देखील sort करता येते. ORDER BY text columns वर देखील काम करतो — alphabetically sort होतो.", example: "-- वयानुसार लहानातून मोठ्याकडे\nSELECT * FROM students\nORDER BY age ASC;\n\n-- marks नुसार मोठ्यातून लहानाकडे\nSELECT * FROM students\nORDER BY marks DESC;\n\n-- नावानुसार alphabetically\nSELECT * FROM students\nORDER BY name ASC;" },
  { id: 9, title: "COUNT, SUM, AVG Functions", content: "SQL मध्ये काही special functions असतात ज्यांना Aggregate Functions म्हणतात. हे functions संपूर्ण table वर काम करतात आणि एक result देतात. COUNT() ने rows ची संख्या काढतो. SUM() ने एखाद्या column च्या सर्व numbers ची बेरीज काढतो. AVG() ने average काढतो. MAX() ने सर्वात मोठी value काढतो. MIN() ने सर्वात लहान value काढतो. हे functions WHERE सोबत देखील वापरता येतात. उदाहरणार्थ फक्त Pune च्या students ची average age काढायची असेल. AS keyword ने result ला एक नाव देता येते ज्याला alias म्हणतात. Aggregate functions real-world database applications मध्ये सर्वत्र वापरले जातात.", example: "-- एकूण किती students आहेत\nSELECT COUNT(*) AS total_students\nFROM students;\n\n-- सर्वांची average age\nSELECT AVG(age) AS average_age\nFROM students;\n\n-- सर्वात जास्त marks\nSELECT MAX(marks) AS highest_marks\nFROM students;" },
  { id: 10, title: "JOIN — दोन Tables जोडणे", content: "JOIN ने आपण दोन किंवा अधिक tables चा data एकत्र काढतो. Real databases मध्ये data वेगवेगळ्या tables मध्ये ठेवला जातो. उदाहरणार्थ एका table मध्ये students ची माहिती आणि दुसऱ्या table मध्ये त्यांचे marks. JOIN ने आपण दोन्ही tables जोडून एकत्र पाहू शकतो. INNER JOIN हे सर्वात common join आहे — हे दोन्ही tables मध्ये matching records दाखवते. JOIN वापरण्यासाठी दोन्ही tables मध्ये एक common column असायला हवा जसे student_id. ON keyword च्या नंतर तो common column लिहतो. JOIN हे खूप powerful feature आहे जे real projects मध्ये सर्वत्र वापरले जाते.", example: "-- students आणि marks tables join करा\nSELECT students.name, students.city, marks.score\nFROM students\nINNER JOIN marks\nON students.id = marks.student_id;\n\n-- WHERE सोबत join\nSELECT students.name, marks.score\nFROM students\nINNER JOIN marks ON students.id = marks.student_id\nWHERE marks.score > 80;" },
]

const javascriptLessons = [
  { 
    id: 1, 
    itle: "JavaScript क्या है?", 
    content: "JavaScript एक programming language है जो websites को interactive और जीवंत बनाती है। जब आप किसी website पर button click करते हैं और कुछ होता है, menu खुलती है, या कोई animation चलती है — यह सब JavaScript की वजह से होता है। JavaScript को 1995 में Brendan Eich ने बनाया था। JavaScript तीन चीज़ों में से एक है जो हर website बनाने के लिए जरूरी है — HTML structure देता है, CSS design देता है, और JavaScript behavior देता है। JavaScript browser में directly चलती है, कोई extra software install करने की जरूरत नहीं। आज JavaScript सिर्फ browser में नहीं बल्कि server पर भी चलती है। JavaScript दुनिया की सबसे popular programming language है और हर web developer को यह जरूर सीखनी चाहिए।", example: null },
  { 
    id: 2, 
    itle: "console.log()", 
    content: "console.log() JavaScript का सबसे पहला और सबसे जरूरी function है। यह Python के print() जैसा ही है। console.log() browser के developer console में कुछ भी print करता है। Developer console देखने के लिए browser में F12 press करें और Console tab पर जाएं। console.log() में हम text, numbers, variables, और calculations — कुछ भी pass कर सकते हैं। Text को quotes के अंदर लिखते हैं — single या double दोनों चलते हैं। console.log() debugging के लिए बहुत उपयोगी है यानी program में क्या हो रहा है यह check करने के लिए। हर JavaScript developer रोज़ console.log() use करता है।", example: 'console.log("नमस्ते दुनिया!");\nconsole.log(42);\nconsole.log("मेरा नाम Pyra है");\nconsole.log(10 + 20);\nconsole.log("2 का square है:", 2 * 2);' },
  { 
    id: 3, 
    itle: "Variables — let, const, var", 
    content: "JavaScript में variables बनाने के तीन तरीके हैं — let, const, और var. Variable एक डिब्बे की तरह है जिसमें हम data रखते हैं। let से वो variable बनाते हैं जिसकी value बाद में बदल सकती है। जैसे score जो game में बदलता रहता है। const से वो variable बनाते हैं जिसकी value कभी नहीं बदलती। जैसे PI की value हमेशा 3.14159 रहती है। var पुराना तरीका है और आजकल use नहीं करते। Variable का नाम हमेशा letter से शुरू होता है, numbers और underscore भी use हो सकते हैं। JavaScript में variable names case sensitive होते हैं — naam और Naam अलग-अलग हैं। हर statement के अंत में semicolon लगाते हैं।", example: 'let naam = "Sharada";\nlet umar = 20;\nconst PI = 3.14159;\n\nconsole.log(naam);\nconsole.log(umar);\n\numar = 21;\nconsole.log(umar);' },
  { 
    id: 4, 
    itle: "Data Types", 
    content: "JavaScript में कई data types होते हैं। String मतलब text जो quotes के अंदर लिखते हैं। Number मतलब कोई भी संख्या चाहे पूरी हो या दशमलव। Boolean मतलब true या false। Null मतलब जानबूझकर खाली value। Undefined मतलब variable बनाया पर value नहीं दी। Object मतलब related data का collection। Array मतलब values की list। JavaScript dynamically typed language है यानी एक variable में पहले number रखो फिर string रखो — चलेगा। typeof operator से किसी भी variable का type check कर सकते हैं।", example: 'let naam = "Pyra";\nlet umar = 20;\nlet marks = 95.5;\nlet isStudent = true;\n\nconsole.log(typeof naam);\nconsole.log(typeof umar);\nconsole.log(`मेरा नाम ${naam} है और उम्र ${umar} है`);' },
  { 
    id: 5, 
    itle: "If/Else Conditions", 
    content: "If/Else JavaScript में decision making के लिए use होता है। Python की तरह ही काम करता है लेकिन syntax थोड़ा अलग है। JavaScript में condition को round brackets के अंदर लिखते हैं और code block को curly braces के अंदर। अगर condition true है तो if block चलता है, नहीं तो else block चलता है। else if से multiple conditions check कर सकते हैं। Triple equals === value और type दोनों check करता है जो better practice है।", example: 'let umar = 18;\n\nif (umar >= 18) {\n  console.log("आप vote कर सकते हैं");\n} else {\n  console.log("आप vote नहीं कर सकते");\n}\n\nlet marks = 75;\nif (marks >= 90) {\n  console.log("Grade: A");\n} else if (marks >= 75) {\n  console.log("Grade: B");\n} else {\n  console.log("Grade: C");\n}' },
  { 
    id: 6, 
    itle: "For Loop", 
    content: "For loop से JavaScript में कोई काम बार बार करवाते हैं। JavaScript का for loop Python से अलग दिखता है लेकिन काम एक जैसा है। For loop में तीन parts होते हैं — initialization जहाँ variable बनाते हैं, condition जो true रहने तक loop चलता है, और update जो हर बार चलता है। तीनों को semicolon से अलग करते हैं। for...of loop से array के हर item पर directly काम कर सकते हैं।", example: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\nlet fruits = ["apple", "banana", "mango"];\nfor (let fruit of fruits) {\n  console.log(fruit);\n}' },
  { 
    id: 7, 
    itle: "Functions", 
    content: "Functions JavaScript में reusable code blocks होते हैं। एक बार function बनाओ और बार बार use करो। JavaScript में functions बनाने के दो main तरीके हैं। पहला है function declaration जिसमें function keyword लिखते हैं। दूसरा है arrow function जो modern और shorter तरीका है। Function को call करने के लिए उसका नाम और brackets लिखते हैं। Parameters वो values हैं जो हम function को देते हैं।", example: 'function greet(naam) {\n  console.log("नमस्ते " + naam + "!");\n}\n\nconst add = (a, b) => a + b;\n\ngreet("Sharada");\ngreet("Pyra");\nconsole.log(add(5, 3));' },
  { 
    id: 8, 
    itle: "Arrays", 
    content: "Array एक list की तरह है जिसमें हम कई values एक साथ रखते हैं। JavaScript में arrays square brackets में बनाते हैं। Array का index 0 से शुरू होता है। length property से array की size पता चलती है। push() से नया item array के अंत में add होता है। forEach() से array के हर item पर एक function चला सकते हैं। map() से array के हर item को transform करके नया array बनता है।", example: 'let fruits = ["apple", "banana", "mango"];\n\nconsole.log(fruits[0]);\nconsole.log(fruits.length);\n\nfruits.push("orange");\n\nlet numbers = [1, 2, 3, 4, 5];\nlet doubled = numbers.map(n => n * 2);\nconsole.log(doubled);' },
  { 
    id: 9, 
    itle: "Objects", 
    content: "Object में हम related data को एक साथ रखते हैं। जैसे एक student का नाम, उम्र, और marks — ये सब एक student object में रख सकते हैं। Object curly braces में बनता है। अंदर key और value pairs होते हैं। Key और value को colon से अलग करते हैं। Object की properties तक पहुँचने के लिए dot notation use करते हैं। Object में functions भी रख सकते हैं जिन्हें methods कहते हैं।", example: 'let student = {\n  naam: "Sharada",\n  umar: 20,\n  sheher: "Mumbai",\n  greet: function() {\n    console.log("नमस्ते, मैं " + this.naam + " हूँ");\n  }\n};\n\nconsole.log(student.naam);\nstudent.greet();' },
  { 
    id: 10,
    title: "DOM Manipulation", 
    content: "DOM का मतलब है Document Object Model। DOM से हम JavaScript की मदद से webpage के elements को बदल सकते हैं। जैसे button click करने पर text बदलना, color बदलना, या नया element add करना। getElementById() से किसी element को उसके id से ढूंढते हैं। innerHTML से element का content बदलते हैं। addEventListener से button click या keyboard press जैसे events सुनते हैं। DOM manipulation से ही websites interactive बनती हैं।", example: '// HTML में: <h1 id="title">पुराना Title</h1>\n// HTML में: <button id="btn">Click करें</button>\n\ndocument.getElementById("title").innerHTML = "नया Title!";\ndocument.getElementById("title").style.color = "blue";\n\ndocument.getElementById("btn").addEventListener("click", function() {\n  alert("Button click हुआ!");\n});' },
]

const javascriptLessonsEnglish = [
  { 
    id: 1, 
    itle: "What is JavaScript?", 
    content: "JavaScript is a programming language that makes websites interactive and alive. When you click a button on a website and something happens, a menu opens, or an animation plays — all of that is because of JavaScript. JavaScript was created in 1995 by Brendan Eich. JavaScript is one of three things needed to build every website — HTML gives the structure, CSS gives the design, and JavaScript gives the behavior. JavaScript runs directly in the browser so no extra software needs to be installed. Today JavaScript runs not only in browsers but also on servers. JavaScript is the most popular programming language in the world and every web developer must learn it.", example: null },
  { 
    id: 2, 
    itle: "console.log()", 
    content: "console.log() is the first and most important function in JavaScript. It works just like print() in Python. console.log() prints anything to the browser's developer console. To open the developer console press F12 in your browser and go to the Console tab. We can pass text, numbers, variables, and calculations to console.log(). Text is written inside quotes — both single and double quotes work. console.log() is very useful for debugging which means checking what is happening in your program. Every JavaScript developer uses console.log() every single day.", example: 'console.log("Hello World!");\nconsole.log(42);\nconsole.log("My name is Pyra");\nconsole.log(10 + 20);' },
  { 
    id: 3, 
    itle: "Variables — let, const, var", 
    content: "There are three ways to create variables in JavaScript — let, const, and var. A variable is like a box where we store data. We use let for variables whose value can change later. For example a score in a game that keeps changing. We use const for variables whose value never changes. For example the value of PI which is always 3.14159. var is the old way and is no longer used in modern JavaScript. Variable names always start with a letter and can include numbers and underscores. JavaScript variable names are case sensitive — name and Name are different.", example: 'let name = "Sharada";\nlet age = 20;\nconst PI = 3.14159;\n\nconsole.log(name);\nage = 21;\nconsole.log(age);' },
  { 
    id: 4, 
    itle: "Data Types", 
    content: "JavaScript has several data types. String means text written inside quotes. Number means any numeric value whether whole or decimal. Boolean means true or false. Null means an intentionally empty value. Undefined means a variable was created but no value was given. Object means a collection of related data. Array means a list of values. JavaScript is a dynamically typed language. The typeof operator lets us check the type of any variable. Template literals use backticks and allow us to embed variables directly inside a string.", example: 'let name = "Pyra";\nlet age = 20;\nlet isStudent = true;\n\nconsole.log(typeof name);\nconsole.log(typeof age);\nconsole.log(`My name is ${name} and I am ${age} years old`);' },
  { 
    id: 5, 
    itle: "If/Else Conditions", 
    content: "If and Else are used for decision making in JavaScript. They work the same way as in Python but the syntax is a little different. In JavaScript the condition is written inside round brackets and the code block is written inside curly braces. If the condition is true the if block runs, otherwise the else block runs. We use else if to check multiple conditions. Triple equals === checks both value and type which is the better practice.", example: 'let age = 18;\n\nif (age >= 18) {\n  console.log("You can vote");\n} else {\n  console.log("You cannot vote");\n}\n\nlet marks = 75;\nif (marks >= 90) {\n  console.log("Grade: A");\n} else if (marks >= 75) {\n  console.log("Grade: B");\n} else {\n  console.log("Grade: C");\n}' },
  { 
    id: 6, 
    itle: "For Loop", 
    content: "A for loop is used to repeat a task multiple times in JavaScript. The JavaScript for loop looks different from Python but works the same way. A for loop has three parts — initialization where we create a variable, a condition that keeps the loop running while true, and an update that runs after every iteration. All three parts are separated by semicolons. The for...of loop lets us work directly with each item in an array which is very easy to use.", example: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\nlet fruits = ["apple", "banana", "mango"];\nfor (let fruit of fruits) {\n  console.log(fruit);\n}' },
  { 
    id: 7, 
    itle: "Functions", 
    content: "Functions are reusable code blocks in JavaScript. Write a function once and use it as many times as you want. There are two main ways to create functions in JavaScript. The first is a function declaration where we write the function keyword. The second is an arrow function which is the modern and shorter way. To call a function we write its name and brackets. Parameters are the values we pass to a function. The return keyword lets a function send back a value.", example: 'function greet(name) {\n  console.log("Hello " + name + "!");\n}\n\nconst add = (a, b) => a + b;\n\ngreet("Sharada");\ngreet("Pyra");\nconsole.log(add(5, 3));' },
  { 
    id: 8, 
    itle: "Arrays", 
    content: "An array is like a list where we store many values together. Arrays in JavaScript are created using square brackets. The index of an array starts from 0. The length property tells us the size of the array. push() adds a new item to the end of the array. forEach() runs a function on every item in the array. map() transforms every item in the array and returns a new array. filter() filters items based on a condition.", example: 'let fruits = ["apple", "banana", "mango"];\n\nconsole.log(fruits[0]);\nconsole.log(fruits.length);\nfruits.push("orange");\n\nlet numbers = [1, 2, 3, 4, 5];\nlet doubled = numbers.map(n => n * 2);\nconsole.log(doubled);' },
  { 
    id: 9, 
    itle: "Objects", 
    content: "Objects are used to store related data together. For example a student's name, age, and marks can all be stored in one student object. An object is created using curly braces. Inside it we have key and value pairs. The key and value are separated by a colon. We use dot notation to access the properties of an object. Objects can also store functions inside them which are called methods.", example: 'let student = {\n  name: "Sharada",\n  age: 20,\n  city: "Mumbai",\n  greet: function() {\n    console.log("Hello, I am " + this.name);\n  }\n};\n\nconsole.log(student.name);\nstudent.greet();' },
  { 
    id: 10,
    title: "DOM Manipulation", 
    content: "DOM stands for Document Object Model. Using the DOM we can change webpage elements with JavaScript. For example changing text when a button is clicked, changing a color, or adding a new element. getElementById() finds an element by its id. innerHTML changes the content of an element. style changes the CSS of an element. addEventListener listens for events like button clicks or keyboard presses. DOM manipulation is what makes websites interactive. This is the most powerful feature of JavaScript.", example: '// In HTML: <h1 id="title">Old Title</h1>\n// In HTML: <button id="btn">Click Me</button>\n\ndocument.getElementById("title").innerHTML = "New Title!";\ndocument.getElementById("title").style.color = "blue";\n\ndocument.getElementById("btn").addEventListener("click", function() {\n  alert("Button was clicked!");\n});' },
]

const javascriptLessonsMarathi = [
  { 
    id: 1, 
    title: "JavaScript म्हणजे काय?", 
    content: "JavaScript ही एक programming language आहे जी websites ला interactive आणि जिवंत बनवते. जेव्हा तुम्ही एखाद्या website वर button click करता आणि काहीतरी होते, menu उघडते, किंवा animation चालते — हे सर्व JavaScript मुळे होते. JavaScript 1995 साली Brendan Eich ने बनवली. JavaScript ही तीन गोष्टींपैकी एक आहे जी प्रत्येक website बनवण्यासाठी आवश्यक आहे — HTML structure देते, CSS design देते, आणि JavaScript behavior देते. JavaScript browser मध्ये directly चालते. JavaScript ही जगातील सर्वात popular programming language आहे आणि प्रत्येक web developer ला ती शिकणे आवश्यक आहे.", example: null },
  { 
    id: 2, 
    title: "console.log()", 
    content: "console.log() हे JavaScript मधील सर्वात पहिले आणि सर्वात महत्त्वाचे function आहे. हे Python च्या print() सारखेच आहे. console.log() browser च्या developer console मध्ये काहीही print करते. Developer console पाहण्यासाठी browser मध्ये F12 press करा आणि Console tab वर जा. console.log() मध्ये आपण text, numbers, variables, आणि calculations — काहीही pass करू शकतो. console.log() debugging साठी खूप उपयुक्त आहे. प्रत्येक JavaScript developer रोज console.log() वापरतो.", example: 'console.log("नमस्कार जग!");\nconsole.log(42);\nconsole.log("माझे नाव Pyra आहे");\nconsole.log(10 + 20);' },
  { 
    id: 3, 
    title: "Variables — let, const, var", 
    content: "JavaScript मध्ये variables बनवण्याचे तीन मार्ग आहेत — let, const, आणि var. Variable म्हणजे एक डबा जिथे आपण data ठेवतो. let ने असे variable बनवतो ज्याची value नंतर बदलू शकते. const ने असे variable बनवतो ज्याची value कधीही बदलत नाही. var हा जुना मार्ग आहे आणि आजकाल वापरत नाही. Variable चे नाव नेहमी letter ने सुरू होते. JavaScript मध्ये variable names case sensitive असतात. प्रत्येक statement च्या शेवटी semicolon लावतो.", example: 'let naam = "Sharada";\nlet vay = 20;\nconst PI = 3.14159;\n\nconsole.log(naam);\nvay = 21;\nconsole.log(vay);' },
  { 
    id: 4, 
    title: "Data Types", 
    content: "JavaScript मध्ये अनेक data types आहेत. String म्हणजे text जे quotes च्या आत लिहतो. Number म्हणजे कोणतीही संख्या. Boolean म्हणजे true किंवा false. Null म्हणजे जाणूनबुजून रिकामी value. Undefined म्हणजे variable बनवला पण value दिली नाही. JavaScript ही dynamically typed language आहे. typeof operator ने कोणत्याही variable चा type check करता येतो. Template literals backtick ने बनतात आणि त्यात variable directly embed करता येतो.", example: 'let naam = "Pyra";\nlet vay = 20;\nlet isStudent = true;\n\nconsole.log(typeof naam);\nconsole.log(typeof vay);\nconsole.log(`माझे नाव ${naam} आहे आणि वय ${vay} आहे`);' },
  { 
    id: 5, 
    title: "If/Else Conditions", 
    content: "If आणि Else JavaScript मध्ये निर्णय घेण्यासाठी वापरतात. Python सारखेच काम करते पण syntax थोडे वेगळे आहे. JavaScript मध्ये condition round brackets च्या आत लिहतो आणि code block curly braces च्या आत लिहतो. जर condition true असेल तर if block चालतो, नाहीतर else block चालतो. else if ने multiple conditions check करता येतात. Triple equals === value आणि type दोन्ही check करतो.", example: 'let vay = 18;\n\nif (vay >= 18) {\n  console.log("तुम्ही मतदान करू शकता");\n} else {\n  console.log("तुम्ही मतदान करू शकत नाही");\n}\n\nlet marks = 75;\nif (marks >= 90) {\n  console.log("Grade: A");\n} else if (marks >= 75) {\n  console.log("Grade: B");\n} else {\n  console.log("Grade: C");\n}' },
  { 
    id: 6, 
    title: "For Loop", 
    content: "For loop ने JavaScript मध्ये एखादे काम अनेक वेळा करवतो. JavaScript चा for loop Python पेक्षा वेगळा दिसतो पण काम तेच करतो. For loop मध्ये तीन parts असतात — initialization, condition, आणि update. तिन्ही parts semicolon ने वेगळे करतो. for...of loop ने array च्या प्रत्येक item वर directly काम करता येते.", example: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\nlet fruits = ["apple", "banana", "mango"];\nfor (let fruit of fruits) {\n  console.log(fruit);\n}' },
  { 
    id: 7, 
    title: "Functions", 
    content: "Functions म्हणजे JavaScript मधील reusable code blocks. एकदा function बनवा आणि अनेक वेळा वापरा. JavaScript मध्ये functions बनवण्याचे दोन main मार्ग आहेत — function declaration आणि arrow function. Arrow function हा modern आणि shorter मार्ग आहे. Function call करण्यासाठी त्याचे नाव आणि brackets लिहतो.", example: 'function namaskaar(naam) {\n  console.log("नमस्कार " + naam + "!");\n}\n\nconst add = (a, b) => a + b;\n\nnamaskaar("Sharada");\nnamaskaar("Pyra");\nconsole.log(add(5, 3));' },
  { 
    id: 8, 
    title: "Arrays", 
    content: "Array म्हणजे एक list जिथे आपण अनेक values एकत्र ठेवतो. JavaScript मध्ये arrays square brackets मध्ये बनवतात. Array चा index 0 पासून सुरू होतो. length property ने array ची size कळते. push() ने नवीन item add होतो. forEach() ने array च्या प्रत्येक item वर function चालवता येते. map() ने नवीन transformed array बनतो.", example: 'let fruits = ["apple", "banana", "mango"];\n\nconsole.log(fruits[0]);\nconsole.log(fruits.length);\nfruits.push("orange");\n\nlet numbers = [1, 2, 3, 4, 5];\nlet doubled = numbers.map(n => n * 2);\nconsole.log(doubled);' },
  { 
    id: 9, 
    title: "Objects", 
    content: "Object मध्ये आपण related data एकत्र ठेवतो. उदाहरणार्थ एका student चे नाव, वय, आणि marks — हे सर्व एका student object मध्ये ठेवता येतात. Object curly braces मध्ये बनतो. आत key आणि value pairs असतात. Object च्या properties पर्यंत पोहोचण्यासाठी dot notation वापरतो. Object मध्ये functions देखील ठेवता येतात ज्यांना methods म्हणतात.", example: 'let student = {\n  naam: "Sharada",\n  vay: 20,\n  shahar: "Pune",\n  greet: function() {\n    console.log("नमस्कार, मी " + this.naam + " आहे");\n  }\n};\n\nconsole.log(student.naam);\nstudent.greet();' },
  { 
    id: 10, 
    title: "DOM Manipulation", 
    content: "DOM चे पूर्ण नाव आहे Document Object Model. DOM ने आपण JavaScript च्या मदतीने webpage चे elements बदलू शकतो. उदाहरणार्थ button click केल्यावर text बदलणे, color बदलणे, किंवा नवीन element add करणे. getElementById() ने element ला त्याच्या id ने शोधतो. innerHTML ने element चा content बदलतो. addEventListener ने events ऐकतो. DOM manipulation मुळेच websites interactive होतात.", example: '// HTML मध्ये: <h1 id="title">जुना Title</h1>\n\ndocument.getElementById("title").innerHTML = "नवीन Title!";\ndocument.getElementById("title").style.color = "blue";\n\ndocument.getElementById("btn").addEventListener("click", function() {\n  alert("Button click झाला!");\n});' },
]

const javaLessons = [
  {
    id: 1,
    title: "Java क्या है?",
    content: "Java एक high-level, object-oriented programming language है जिसे 1995 में James Gosling ने Sun Microsystems में बनाया था। Java का सबसे बड़ा फायदा है — Write Once, Run Anywhere। इसका मतलब है कि आप एक बार Java में program लिखो और वो किसी भी computer पर चल सकता है — चाहे Windows हो, Mac हो, या Linux हो। यह इसलिए possible है क्योंकि Java code पहले bytecode में convert होता है और फिर JVM यानी Java Virtual Machine उस bytecode को run करती है। Java दुनिया की सबसे popular programming languages में से एक है। Android apps, banking systems, और बड़ी companies के software Java में बने हैं। Google, Amazon, और Netflix भी Java use करती हैं। Java strongly typed language है यानी हर variable का type पहले से declare करना पड़ता है।",
    example: null
  },
  {
    id: 2,
    title: "Java का पहला Program",
    content: "Java में हर program एक class के अंदर होता है। Class का नाम और file का नाम हमेशा एक जैसा होना चाहिए। main method वो जगह है जहाँ से program शुरू होता है। public का मतलब है कि यह method सबके लिए accessible है। static का मतलब है कि इसे बिना object बनाए call किया जा सकता है। void का मतलब है कि यह method कोई value return नहीं करता। System.out.println() से हम screen पर कुछ print करते हैं। println का मतलब है print line — यह print करके नई line पर जाता है। हर statement के अंत में semicolon लगाना जरूरी है। Java case-sensitive है यानी Main और main अलग-अलग हैं।",
    example: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("नमस्ते दुनिया!");\n        System.out.println("मेरा पहला Java program");\n        System.out.println(2024);\n    }\n}'
  },
  {
    id: 3,
    title: "Variables और Data Types",
    content: "Java में variables declare करते समय उनका data type लिखना जरूरी है। यह Python से अलग है जहाँ type automatically समझ जाता है। int से पूरी संख्या store होती है जैसे 5, 100, -20। double से दशमलव संख्या store होती है जैसे 3.14, 9.99। String से text store होता है और String capital S से लिखते हैं। boolean से सिर्फ true या false store होता है। char से एक अकेला character store होता है और single quotes में लिखते हैं। long से बहुत बड़ी संख्या store होती है। float भी दशमलव के लिए है लेकिन double ज्यादा accurate होता है। Java में variable declare करने के बाद उसकी value change कर सकते हैं लेकिन type नहीं बदलती।",
    example: 'public class Variables {\n    public static void main(String[] args) {\n        int umar = 20;\n        double height = 5.9;\n        String naam = "Sharada";\n        boolean isStudent = true;\n        char grade = \'A\';\n        \n        System.out.println("नाम: " + naam);\n        System.out.println("उम्र: " + umar);\n        System.out.println("Height: " + height);\n        System.out.println("Student: " + isStudent);\n        System.out.println("Grade: " + grade);\n    }\n}'
  },
  {
    id: 4,
    title: "User से Input लेना — Scanner",
    content: "Java में user से input लेने के लिए Scanner class use करते हैं। Scanner java.util package में होता है इसलिए पहले import करना पड़ता है। import java.util.Scanner; लिखकर Scanner को program में लाते हैं। फिर Scanner का object बनाते हैं — Scanner sc = new Scanner(System.in)। System.in का मतलब है keyboard से input लेना। nextInt() से integer input लेते हैं। nextDouble() से decimal number लेते हैं। next() से एक word लेते हैं। nextLine() से पूरी line लेते हैं। Input लेने से पहले user को बताना चाहिए कि क्या type करना है इसलिए System.out.print() से message दिखाते हैं। Scanner use करने के बाद sc.close() से बंद करना अच्छी practice है।",
    example: 'import java.util.Scanner;\n\npublic class InputExample {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        \n        System.out.print("आपका नाम क्या है? ");\n        String naam = sc.nextLine();\n        \n        System.out.print("आपकी उम्र क्या है? ");\n        int umar = sc.nextInt();\n        \n        System.out.println("नमस्ते " + naam + "!");\n        System.out.println("आपकी उम्र है: " + umar);\n        \n        sc.close();\n    }\n}'
  },
  {
    id: 5,
    title: "If/Else Conditions",
    content: "Java में if/else से हम computer को decision लेना सिखाते हैं। Java का if/else syntax Python से थोड़ा अलग है। Java में condition round brackets () में लिखते हैं और code block curly braces {} में लिखते हैं। अगर condition true है तो if block चलता है, नहीं तो else block चलता है। else if से multiple conditions check कर सकते हैं। Comparison operators: == equal to, != not equal to, > greater than, < less than, >= greater than or equal to, <= less than or equal to। Logical operators: && means AND, || means OR, ! means NOT। Java में triple equals नहीं होता, double equals == से compare करते हैं। String compare करने के लिए equals() method use करते हैं, == नहीं।",
    example: 'public class Conditions {\n    public static void main(String[] args) {\n        int umar = 18;\n        \n        if (umar >= 18) {\n            System.out.println("आप vote कर सकते हैं");\n        } else {\n            System.out.println("आप vote नहीं कर सकते");\n        }\n        \n        int marks = 85;\n        if (marks >= 90) {\n            System.out.println("Grade: A+");\n        } else if (marks >= 75) {\n            System.out.println("Grade: A");\n        } else if (marks >= 60) {\n            System.out.println("Grade: B");\n        } else {\n            System.out.println("Grade: C");\n        }\n    }\n}'
  },
  {
    id: 6,
    title: "Loops — For और While",
    content: "Java में loops से हम कोई काम बार-बार करवाते हैं। For loop तब use करते हैं जब हमें पता हो कितनी बार loop चलेगा। For loop में तीन parts होते हैं — initialization जहाँ variable बनाते हैं, condition जो true रहने तक loop चलता है, और update जो हर बार execute होता है। While loop तब use करते हैं जब condition पर depend करना हो। Do-while loop कम से कम एक बार जरूर चलता है, condition बाद में check होती है। break statement से loop तुरंत बंद होता है। continue statement से current iteration skip होती है और अगली iteration शुरू होती है। Nested loops यानी loop के अंदर loop भी लिख सकते हैं जो pattern printing में काम आता है।",
    example: 'public class Loops {\n    public static void main(String[] args) {\n        // For loop\n        for (int i = 1; i <= 5; i++) {\n            System.out.println("Count: " + i);\n        }\n        \n        // While loop\n        int count = 1;\n        while (count <= 3) {\n            System.out.println("While: " + count);\n            count++;\n        }\n        \n        // 1 से 10 तक squares\n        for (int i = 1; i <= 10; i++) {\n            System.out.println(i + " का square: " + (i * i));\n        }\n    }\n}'
  },
  {
    id: 7,
    title: "Arrays",
    content: "Array एक ऐसा container है जिसमें एक ही type की multiple values एक साथ store होती हैं। Java में array का size declare करते समय ही fix हो जाता है, बाद में बदल नहीं सकते। Array declare करने के लिए data type के बाद [] लिखते हैं। new keyword से array का memory allocate होता है। Array का index 0 से शुरू होता है। length property से array की size पता चलती है। For loop से array के सभी elements को access कर सकते हैं। Enhanced for loop यानी for-each loop से array iterate करना और भी आसान होता है। 2D array यानी array of arrays से matrix बना सकते हैं। Arrays.sort() से array को sort कर सकते हैं — इसके लिए java.util.Arrays import करना पड़ता है।",
    example: 'import java.util.Arrays;\n\npublic class ArrayExample {\n    public static void main(String[] args) {\n        // Array declare और initialize\n        int[] numbers = {10, 20, 30, 40, 50};\n        String[] fruits = {"apple", "banana", "mango"};\n        \n        System.out.println("पहला element: " + numbers[0]);\n        System.out.println("Array की size: " + numbers.length);\n        \n        // For-each loop\n        for (String fruit : fruits) {\n            System.out.println(fruit);\n        }\n        \n        // Array sort करें\n        int[] scores = {85, 42, 91, 67, 78};\n        Arrays.sort(scores);\n        System.out.println("Sorted: " + Arrays.toString(scores));\n    }\n}'
  },
  {
    id: 8,
    title: "Methods (Functions)",
    content: "Java में functions को methods कहते हैं और ये हमेशा किसी class के अंदर होते हैं। Method declaration में access modifier, return type, method name, और parameters होते हैं। public मतलब सबके लिए accessible। static मतलब object बिना call कर सकते हैं। Return type बताता है कि method क्या return करेगा — अगर कुछ return नहीं करना तो void लिखते हैं। Parameters वो values हैं जो method को दी जाती हैं। Return keyword से value वापस मिलती है। Method overloading का मतलब है same name के multiple methods लेकिन अलग-अलग parameters। यह Java की एक powerful feature है। Recursion यानी method का खुद को call करना भी possible है।",
    example: 'public class Methods {\n    // Simple method\n    public static void greet(String naam) {\n        System.out.println("नमस्ते " + naam + "!");\n    }\n    \n    // Return वाला method\n    public static int add(int a, int b) {\n        return a + b;\n    }\n    \n    // Method overloading\n    public static double add(double a, double b) {\n        return a + b;\n    }\n    \n    public static void main(String[] args) {\n        greet("Sharada");\n        greet("Pyra");\n        \n        System.out.println("5 + 3 = " + add(5, 3));\n        System.out.println("2.5 + 1.5 = " + add(2.5, 1.5));\n    }\n}'
  },
  {
    id: 9,
    title: "Object-Oriented Programming — Classes और Objects",
    content: "Java एक object-oriented language है और OOP इसका सबसे important concept है। Real world में सब कुछ objects हैं — car, student, bank account। Class एक blueprint या template होती है जो बताती है कि object में क्या data और क्या behavior होगा। Object उस class का एक instance होता है। Class में दो चीजें होती हैं — fields यानी data variables और methods यानी behavior functions। Constructor एक special method होता है जो object बनाते समय automatically call होता है। Constructor का नाम class के नाम जैसा होता है और इसका कोई return type नहीं होता। new keyword से object बनाते हैं। Dot operator से object के fields और methods access करते हैं।",
    example: 'public class Student {\n    // Fields\n    String naam;\n    int umar;\n    double marks;\n    \n    // Constructor\n    public Student(String naam, int umar, double marks) {\n        this.naam = naam;\n        this.umar = umar;\n        this.marks = marks;\n    }\n    \n    // Method\n    public void displayInfo() {\n        System.out.println("नाम: " + naam);\n        System.out.println("उम्र: " + umar);\n        System.out.println("Marks: " + marks);\n    }\n    \n    public static void main(String[] args) {\n        Student s1 = new Student("Sharada", 20, 92.5);\n        Student s2 = new Student("Rahul", 22, 87.0);\n        \n        s1.displayInfo();\n        System.out.println("---");\n        s2.displayInfo();\n    }\n}'
  },
  {
    id: 10,
    title: "Encapsulation — Data छुपाना",
    content: "Encapsulation OOP का एक important principle है। इसका मतलब है class के data को direct access से protect करना। इसे data hiding भी कहते हैं। Encapsulation में fields को private बनाते हैं ताकि बाहर से direct access न हो सके। Private fields को access करने के लिए public getter और setter methods बनाते हैं। Getter method से field की value पढ़ते हैं और setter method से value set करते हैं। इससे data validation possible होती है — setter में check कर सकते हैं कि value valid है या नहीं। जैसे age setter में check कर सकते हैं कि age negative तो नहीं है। Encapsulation से code maintainable और secure बनता है। यह real-world projects में बहुत जरूरी है।",
    example: 'public class BankAccount {\n    private String owner;\n    private double balance;\n    \n    public BankAccount(String owner, double balance) {\n        this.owner = owner;\n        this.balance = balance;\n    }\n    \n    // Getter\n    public double getBalance() {\n        return balance;\n    }\n    \n    // Setter with validation\n    public void deposit(double amount) {\n        if (amount > 0) {\n            balance += amount;\n            System.out.println(amount + " जमा हुए। नया balance: " + balance);\n        } else {\n            System.out.println("Invalid amount!");\n        }\n    }\n    \n    public void withdraw(double amount) {\n        if (amount > 0 && amount <= balance) {\n            balance -= amount;\n            System.out.println(amount + " निकाले। नया balance: " + balance);\n        } else {\n            System.out.println("Insufficient balance!");\n        }\n    }\n    \n    public static void main(String[] args) {\n        BankAccount acc = new BankAccount("Sharada", 5000);\n        acc.deposit(2000);\n        acc.withdraw(1500);\n        System.out.println("Balance: " + acc.getBalance());\n    }\n}'
  },
  {
    id: 11,
    title: "Inheritance — विरासत",
    content: "Inheritance OOP का एक और important concept है। इसमें एक class दूसरी class के properties और methods inherit कर सकती है। जो class inherit करती है उसे child class या subclass कहते हैं। जिस class से inherit होता है उसे parent class या superclass कहते हैं। extends keyword से inheritance होती है। Child class parent class के सभी public और protected members use कर सकती है। Child class अपने नए methods और fields भी add कर सकती है। Method overriding में child class parent class के method को अपने तरीके से redefine करती है। @Override annotation से बताते हैं कि यह method override हो रहा है। super keyword से parent class के constructor और methods access करते हैं।",
    example: 'public class Animal {\n    String naam;\n    \n    public Animal(String naam) {\n        this.naam = naam;\n    }\n    \n    public void sound() {\n        System.out.println(naam + " कुछ आवाज़ करता है");\n    }\n}\n\npublic class Dog extends Animal {\n    String breed;\n    \n    public Dog(String naam, String breed) {\n        super(naam);  // parent constructor\n        this.breed = breed;\n    }\n    \n    @Override\n    public void sound() {\n        System.out.println(naam + " भौंकता है: Woof!");\n    }\n    \n    public void fetch() {\n        System.out.println(naam + " ball लाता है!");\n    }\n    \n    public static void main(String[] args) {\n        Dog d = new Dog("Tommy", "Labrador");\n        d.sound();\n        d.fetch();\n    }\n}'
  },
  {
    id: 12,
    title: "ArrayList और Collections",
    content: "Java में Array का size fixed होता है लेकिन ArrayList का size dynamic होता है — जरूरत के हिसाब से बढ़ता है। ArrayList java.util package में है इसलिए import करना पड़ता है। ArrayList में object store होते हैं इसलिए int की जगह Integer, double की जगह Double लिखते हैं — इन्हें Wrapper classes कहते हैं। add() से element add होता है। get(index) से element access होता है। remove(index) से element हटता है। size() से ArrayList की size पता चलती है। contains() से check होता है कि element है या नहीं। for-each loop से सभी elements iterate कर सकते हैं। Collections.sort() से ArrayList sort होती है। ArrayList बहुत useful है क्योंकि real projects में हमें dynamic size की list चाहिए होती है।",
    example: 'import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class ArrayListExample {\n    public static void main(String[] args) {\n        ArrayList<String> fruits = new ArrayList<>();\n        \n        // Elements add करें\n        fruits.add("Apple");\n        fruits.add("Banana");\n        fruits.add("Mango");\n        fruits.add("Orange");\n        \n        System.out.println("Fruits: " + fruits);\n        System.out.println("Size: " + fruits.size());\n        System.out.println("पहला: " + fruits.get(0));\n        \n        // Remove करें\n        fruits.remove("Banana");\n        System.out.println("Remove के बाद: " + fruits);\n        \n        // Sort करें\n        Collections.sort(fruits);\n        System.out.println("Sorted: " + fruits);\n        \n        // for-each से iterate\n        for (String fruit : fruits) {\n            System.out.println("- " + fruit);\n        }\n    }\n}'
  },
  {
    id: 13,
    title: "Exception Handling",
    content: "Exception एक error होती है जो program के चलते समय आती है और program को crash कर देती है। Java में Exception handling से हम इन errors को gracefully handle करते हैं। try block में वो code लिखते हैं जिसमें exception आ सकती है। catch block में exception को handle करते हैं। finally block का code हमेशा चलता है, चाहे exception आए या न आए। Multiple catch blocks से अलग-अलग exceptions handle कर सकते हैं। ArithmeticException zero से divide करने पर आती है। ArrayIndexOutOfBoundsException गलत index access करने पर आती है। NumberFormatException जब string को invalid number में convert करते हैं। NullPointerException null object पर operation करने पर आती है। throw keyword से खुद exception create कर सकते हैं।",
    example: 'public class ExceptionExample {\n    public static void main(String[] args) {\n        // ArithmeticException handle\n        try {\n            int result = 10 / 0;\n            System.out.println(result);\n        } catch (ArithmeticException e) {\n            System.out.println("Error: " + e.getMessage());\n        } finally {\n            System.out.println("यह हमेशा चलता है");\n        }\n        \n        // NumberFormatException handle\n        try {\n            int num = Integer.parseInt("hello");\n        } catch (NumberFormatException e) {\n            System.out.println("Invalid number format!");\n        }\n        \n        // Multiple exceptions\n        try {\n            int[] arr = {1, 2, 3};\n            System.out.println(arr[10]);\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println("Array index out of bounds!");\n        }\n    }\n}'
  },
  {
    id: 14,
    title: "String Methods",
    content: "Java में String एक class है और इसमें बहुत सारे useful methods होते हैं। length() से string की length पता चलती है। charAt(index) से specific position का character मिलता है। substring(start, end) से string का हिस्सा निकालते हैं। toLowerCase() और toUpperCase() से case बदलते हैं। trim() से string के शुरू और अंत के spaces हटते हैं। replace(old, new) से characters या substrings replace होते हैं। contains() से check होता है कि string में कोई substring है या नहीं। startsWith() और endsWith() से string की शुरुआत और अंत check होता है। split() से string को parts में तोड़ते हैं। equals() से string comparison होती है। Java में Strings immutable होती हैं यानी एक बार बनने के बाद change नहीं होतीं, बल्कि नई String बनती है।",
    example: 'public class StringMethods {\n    public static void main(String[] args) {\n        String s = "  Hello World Java  ";\n        \n        System.out.println("Length: " + s.trim().length());\n        System.out.println("Uppercase: " + s.toUpperCase());\n        System.out.println("Lowercase: " + s.toLowerCase());\n        System.out.println("Trim: \'" + s.trim() + "\'");\n        System.out.println("Replace: " + s.replace("Java", "Drishti"));\n        System.out.println("Contains \'World\': " + s.contains("World"));\n        System.out.println("Starts with \'  Hello\': " + s.startsWith("  Hello"));\n        System.out.println("Substring: " + s.trim().substring(0, 5));\n        \n        // Split\n        String fruits = "apple,banana,mango";\n        String[] arr = fruits.split(",");\n        for (String f : arr) {\n            System.out.println(f);\n        }\n    }\n}'
  },
  {
    id: 15,
    title: "Mini Project — Student Management System",
    content: "शाबाश! आपने Java के सभी important concepts सीख लिए। अब हम इन सब को मिलाकर एक Student Management System बनाएंगे। इस project में हम OOP concepts use करेंगे — class, objects, ArrayList, methods, और exception handling। यह एक real-world जैसा project है जो interview में भी पूछा जाता है। इस project में Student class होगी जिसमें student की information होगी। StudentManager class में students की ArrayList होगी जिसमें add, display, और search करने के methods होंगे। यह project आपको Java के practical use को समझाएगा। इसे बनाने के बाद आप कह सकते हैं कि मैंने Java में एक real project बनाया है।",
    example: 'import java.util.ArrayList;\n\nclass Student {\n    private String naam;\n    private int rollNo;\n    private double marks;\n    \n    public Student(String naam, int rollNo, double marks) {\n        this.naam = naam;\n        this.rollNo = rollNo;\n        this.marks = marks;\n    }\n    \n    public String getNaam() { return naam; }\n    public int getRollNo() { return rollNo; }\n    public double getMarks() { return marks; }\n    \n    public void display() {\n        System.out.println("Roll: " + rollNo + " | Name: " + naam + " | Marks: " + marks);\n    }\n}\n\npublic class StudentManager {\n    ArrayList<Student> students = new ArrayList<>();\n    \n    public void addStudent(Student s) {\n        students.add(s);\n        System.out.println(s.getNaam() + " added successfully!");\n    }\n    \n    public void displayAll() {\n        System.out.println("=== सभी Students ===");\n        for (Student s : students) {\n            s.display();\n        }\n    }\n    \n    public static void main(String[] args) {\n        StudentManager mgr = new StudentManager();\n        mgr.addStudent(new Student("Sharada", 1, 92.5));\n        mgr.addStudent(new Student("Rahul", 2, 87.0));\n        mgr.addStudent(new Student("Priya", 3, 95.5));\n        mgr.displayAll();\n    }\n}'
  },
]


const javaLessonsEnglish = [
  {
    id: 1,
    title: "What is Java?",
    content: "Java is a high-level, object-oriented programming language created in 1995 by James Gosling at Sun Microsystems. The biggest advantage of Java is its philosophy — Write Once, Run Anywhere. This means you write a Java program once and it can run on any computer, whether it is Windows, Mac, or Linux. This is possible because Java code is first converted into bytecode and then the JVM which stands for Java Virtual Machine runs that bytecode on any platform. Java is one of the most popular programming languages in the world. Android apps, banking systems, and software for large companies are built in Java. Google, Amazon, and Netflix all use Java. Java is a strongly typed language which means the type of every variable must be declared before use.",
    example: null
  },
  {
    id: 2,
    title: "First Java Program",
    content: "In Java every program lives inside a class. The class name and the file name must always be the same. The main method is where the program starts running. The word public means this method is accessible to everyone. The word static means it can be called without creating an object. The word void means this method does not return any value. System.out.println() is used to print something on the screen. println stands for print line which prints the text and then moves to a new line. Every statement must end with a semicolon. Java is case-sensitive which means Main and main are treated as completely different things.",
    example: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n        System.out.println("My first Java program");\n        System.out.println(2024);\n    }\n}'
  },
  {
    id: 3,
    title: "Variables and Data Types",
    content: "In Java you must declare the data type of a variable before using it. This is different from Python where the type is understood automatically. The int type stores whole numbers like 5, 100, or -20. The double type stores decimal numbers like 3.14 or 9.99. The String type stores text and note that String is written with a capital S. The boolean type stores only true or false. The char type stores a single character and is written inside single quotes. The long type stores very large numbers. float also stores decimals but double is more accurate. In Java once a variable is declared its type cannot be changed but its value can be updated.",
    example: 'public class Variables {\n    public static void main(String[] args) {\n        int age = 20;\n        double height = 5.9;\n        String name = "Sharada";\n        boolean isStudent = true;\n        char grade = \'A\';\n        \n        System.out.println("Name: " + name);\n        System.out.println("Age: " + age);\n        System.out.println("Height: " + height);\n        System.out.println("Student: " + isStudent);\n        System.out.println("Grade: " + grade);\n    }\n}'
  },
  {
    id: 4,
    title: "Taking Input from User — Scanner",
    content: "In Java we use the Scanner class to take input from the user. Scanner is in the java.util package so we must import it first by writing import java.util.Scanner at the top. Then we create a Scanner object like this: Scanner sc = new Scanner(System.in). System.in means we are taking input from the keyboard. We use nextInt() to read an integer, nextDouble() for a decimal number, next() for a single word, and nextLine() for a full line of text. Before taking input we should show the user a message using System.out.print() so they know what to type. It is good practice to close the Scanner using sc.close() after we are done using it.",
    example: 'import java.util.Scanner;\n\npublic class InputExample {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        \n        System.out.print("What is your name? ");\n        String name = sc.nextLine();\n        \n        System.out.print("What is your age? ");\n        int age = sc.nextInt();\n        \n        System.out.println("Hello " + name + "!");\n        System.out.println("Your age is: " + age);\n        \n        sc.close();\n    }\n}'
  },
  {
    id: 5,
    title: "If/Else Conditions",
    content: "In Java we use if and else to teach the computer how to make decisions. The syntax in Java is slightly different from Python. In Java the condition is written inside round brackets and the code block is written inside curly braces. If the condition is true the if block runs, otherwise the else block runs. We use else if to check multiple conditions. The comparison operators are: == for equal to, != for not equal to, > for greater than, < for less than, >= for greater than or equal to, and <= for less than or equal to. The logical operators are: && means AND, || means OR, and ! means NOT. Java does not have triple equals. To compare Strings we use the equals() method rather than == because == checks memory address not value.",
    example: 'public class Conditions {\n    public static void main(String[] args) {\n        int age = 18;\n        \n        if (age >= 18) {\n            System.out.println("You can vote");\n        } else {\n            System.out.println("You cannot vote");\n        }\n        \n        int marks = 85;\n        if (marks >= 90) {\n            System.out.println("Grade: A+");\n        } else if (marks >= 75) {\n            System.out.println("Grade: A");\n        } else if (marks >= 60) {\n            System.out.println("Grade: B");\n        } else {\n            System.out.println("Grade: C");\n        }\n    }\n}'
  },
  {
    id: 6,
    title: "Loops — For and While",
    content: "In Java we use loops to repeat a task multiple times. We use a for loop when we know in advance how many times the loop should run. A for loop has three parts: initialization where we create a variable, a condition that keeps the loop running while true, and an update that runs after every iteration. We use a while loop when the number of iterations depends on a condition. A do-while loop always runs at least once because the condition is checked after the first run. The break statement immediately stops the loop. The continue statement skips the current iteration and moves to the next one. Nested loops which are loops inside loops are used for printing patterns and working with 2D data.",
    example: 'public class Loops {\n    public static void main(String[] args) {\n        // For loop\n        for (int i = 1; i <= 5; i++) {\n            System.out.println("Count: " + i);\n        }\n        \n        // While loop\n        int count = 1;\n        while (count <= 3) {\n            System.out.println("While: " + count);\n            count++;\n        }\n        \n        // Squares from 1 to 10\n        for (int i = 1; i <= 10; i++) {\n            System.out.println(i + " squared: " + (i * i));\n        }\n    }\n}'
  },
  {
    id: 7,
    title: "Arrays",
    content: "An array is a container that stores multiple values of the same type together. In Java the size of an array is fixed at the time of declaration and cannot be changed later. To declare an array we write the data type followed by square brackets. We use the new keyword to allocate memory for the array. The index of an array starts from 0. The length property gives us the size of the array. We can access all elements using a for loop. The enhanced for loop also called the for-each loop makes iterating over arrays even easier. A 2D array which is an array of arrays is used to represent a matrix or table. We can sort an array using Arrays.sort() by importing java.util.Arrays.",
    example: 'import java.util.Arrays;\n\npublic class ArrayExample {\n    public static void main(String[] args) {\n        int[] numbers = {10, 20, 30, 40, 50};\n        String[] fruits = {"apple", "banana", "mango"};\n        \n        System.out.println("First element: " + numbers[0]);\n        System.out.println("Array size: " + numbers.length);\n        \n        // For-each loop\n        for (String fruit : fruits) {\n            System.out.println(fruit);\n        }\n        \n        // Sort the array\n        int[] scores = {85, 42, 91, 67, 78};\n        Arrays.sort(scores);\n        System.out.println("Sorted: " + Arrays.toString(scores));\n    }\n}'
  },
  {
    id: 8,
    title: "Methods (Functions)",
    content: "In Java functions are called methods and they always live inside a class. A method declaration includes an access modifier, a return type, a method name, and parameters. The word public means it is accessible to everyone. The word static means it can be called without creating an object. The return type tells us what the method will return. If the method returns nothing we write void. Parameters are the values passed into the method. The return keyword sends a value back to the caller. Method overloading means having multiple methods with the same name but different parameters. This is one of the powerful features of Java. Recursion where a method calls itself is also supported in Java and is useful for problems like factorial and Fibonacci.",
    example: 'public class Methods {\n    public static void greet(String name) {\n        System.out.println("Hello " + name + "!");\n    }\n    \n    public static int add(int a, int b) {\n        return a + b;\n    }\n    \n    // Method overloading\n    public static double add(double a, double b) {\n        return a + b;\n    }\n    \n    public static void main(String[] args) {\n        greet("Sharada");\n        greet("Pyra");\n        \n        System.out.println("5 + 3 = " + add(5, 3));\n        System.out.println("2.5 + 1.5 = " + add(2.5, 1.5));\n    }\n}'
  },
  {
    id: 9,
    title: "Object-Oriented Programming — Classes and Objects",
    content: "Java is an object-oriented language and OOP is its most important concept. In the real world everything is an object — a car, a student, a bank account. A class is a blueprint or template that describes what data and behavior an object will have. An object is an instance of that class. A class has two things: fields which are the data variables, and methods which are the behavior functions. A constructor is a special method that is automatically called when an object is created. The constructor has the same name as the class and has no return type. We use the new keyword to create an object. We use the dot operator to access the fields and methods of an object. The this keyword refers to the current object inside a method or constructor.",
    example: 'public class Student {\n    String name;\n    int age;\n    double marks;\n    \n    public Student(String name, int age, double marks) {\n        this.name = name;\n        this.age = age;\n        this.marks = marks;\n    }\n    \n    public void displayInfo() {\n        System.out.println("Name: " + name);\n        System.out.println("Age: " + age);\n        System.out.println("Marks: " + marks);\n    }\n    \n    public static void main(String[] args) {\n        Student s1 = new Student("Sharada", 20, 92.5);\n        Student s2 = new Student("Rahul", 22, 87.0);\n        \n        s1.displayInfo();\n        System.out.println("---");\n        s2.displayInfo();\n    }\n}'
  },
  {
    id: 10,
    title: "Encapsulation — Hiding Data",
    content: "Encapsulation is one of the core principles of OOP. It means protecting the data inside a class from direct access from outside. It is also called data hiding. In encapsulation we make the fields private so they cannot be accessed directly from outside the class. To access private fields we create public getter and setter methods. A getter method reads the value of a field and a setter method sets the value of a field. This allows data validation inside the setter. For example in an age setter we can check that the age is not a negative number. Encapsulation makes code more maintainable and secure. It is a must in real-world professional projects. The idea is to expose only what is necessary and hide everything else.",
    example: 'public class BankAccount {\n    private String owner;\n    private double balance;\n    \n    public BankAccount(String owner, double balance) {\n        this.owner = owner;\n        this.balance = balance;\n    }\n    \n    public double getBalance() {\n        return balance;\n    }\n    \n    public void deposit(double amount) {\n        if (amount > 0) {\n            balance += amount;\n            System.out.println(amount + " deposited. New balance: " + balance);\n        } else {\n            System.out.println("Invalid amount!");\n        }\n    }\n    \n    public void withdraw(double amount) {\n        if (amount > 0 && amount <= balance) {\n            balance -= amount;\n            System.out.println(amount + " withdrawn. New balance: " + balance);\n        } else {\n            System.out.println("Insufficient balance!");\n        }\n    }\n    \n    public static void main(String[] args) {\n        BankAccount acc = new BankAccount("Sharada", 5000);\n        acc.deposit(2000);\n        acc.withdraw(1500);\n        System.out.println("Balance: " + acc.getBalance());\n    }\n}'
  },
  {
    id: 11,
    title: "Inheritance",
    content: "Inheritance is another important concept in OOP. It allows one class to inherit the properties and methods of another class. The class that inherits is called the child class or subclass. The class it inherits from is called the parent class or superclass. We use the extends keyword to set up inheritance. The child class can use all the public and protected members of the parent class. The child class can also add its own new methods and fields. Method overriding is when the child class redefines a method that already exists in the parent class. We use the @Override annotation to indicate that a method is being overridden. The super keyword is used to access the parent class constructor and methods from inside the child class.",
    example: 'class Animal {\n    String name;\n    \n    public Animal(String name) {\n        this.name = name;\n    }\n    \n    public void sound() {\n        System.out.println(name + " makes a sound");\n    }\n}\n\npublic class Dog extends Animal {\n    String breed;\n    \n    public Dog(String name, String breed) {\n        super(name);\n        this.breed = breed;\n    }\n    \n    @Override\n    public void sound() {\n        System.out.println(name + " barks: Woof!");\n    }\n    \n    public void fetch() {\n        System.out.println(name + " fetches the ball!");\n    }\n    \n    public static void main(String[] args) {\n        Dog d = new Dog("Tommy", "Labrador");\n        d.sound();\n        d.fetch();\n    }\n}'
  },
  {
    id: 12,
    title: "ArrayList and Collections",
    content: "In Java the size of an Array is fixed but the size of an ArrayList is dynamic meaning it grows as needed. ArrayList is in the java.util package so we must import it. ArrayList stores objects so instead of int we write Integer and instead of double we write Double. These are called Wrapper classes. We use add() to add an element, get(index) to access an element, remove(index) to delete an element, and size() to find how many elements there are. The contains() method checks whether an element exists. We can iterate through all elements using a for-each loop. We can sort an ArrayList using Collections.sort(). ArrayList is very useful in real projects because we almost always need a list whose size changes at runtime.",
    example: 'import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class ArrayListExample {\n    public static void main(String[] args) {\n        ArrayList<String> fruits = new ArrayList<>();\n        \n        fruits.add("Apple");\n        fruits.add("Banana");\n        fruits.add("Mango");\n        fruits.add("Orange");\n        \n        System.out.println("Fruits: " + fruits);\n        System.out.println("Size: " + fruits.size());\n        System.out.println("First: " + fruits.get(0));\n        \n        fruits.remove("Banana");\n        System.out.println("After remove: " + fruits);\n        \n        Collections.sort(fruits);\n        System.out.println("Sorted: " + fruits);\n        \n        for (String fruit : fruits) {\n            System.out.println("- " + fruit);\n        }\n    }\n}'
  },
  {
    id: 13,
    title: "Exception Handling",
    content: "An exception is an error that occurs while a program is running and causes it to crash. In Java we use exception handling to deal with these errors gracefully so the program does not stop unexpectedly. We write the code that might cause an error inside the try block. The catch block handles the exception if one occurs. The finally block always runs whether or not an exception occurred and is used for cleanup tasks. We can have multiple catch blocks to handle different types of exceptions. ArithmeticException occurs when we divide by zero. ArrayIndexOutOfBoundsException occurs when we access a wrong array index. NumberFormatException occurs when we try to convert an invalid string to a number. NullPointerException occurs when we try to use a null object. We can also create and throw our own exceptions using the throw keyword.",
    example: 'public class ExceptionExample {\n    public static void main(String[] args) {\n        try {\n            int result = 10 / 0;\n            System.out.println(result);\n        } catch (ArithmeticException e) {\n            System.out.println("Error: " + e.getMessage());\n        } finally {\n            System.out.println("This always runs");\n        }\n        \n        try {\n            int num = Integer.parseInt("hello");\n        } catch (NumberFormatException e) {\n            System.out.println("Invalid number format!");\n        }\n        \n        try {\n            int[] arr = {1, 2, 3};\n            System.out.println(arr[10]);\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println("Array index out of bounds!");\n        }\n    }\n}'
  },
  {
    id: 14,
    title: "String Methods",
    content: "In Java String is a class and it comes with many useful built-in methods. The length() method returns the number of characters in the string. charAt(index) returns the character at a specific position. substring(start, end) extracts a part of the string. toLowerCase() and toUpperCase() change the case of all characters. trim() removes whitespace from the beginning and end of the string. replace(old, new) replaces characters or substrings. contains() checks whether a substring exists in the string. startsWith() and endsWith() check the beginning and end of the string. split() breaks the string into parts based on a delimiter. equals() compares two strings for equality. Strings in Java are immutable meaning once created they cannot be modified. Any operation creates a new String object.",
    example: 'public class StringMethods {\n    public static void main(String[] args) {\n        String s = "  Hello World Java  ";\n        \n        System.out.println("Length: " + s.trim().length());\n        System.out.println("Uppercase: " + s.toUpperCase());\n        System.out.println("Lowercase: " + s.toLowerCase());\n        System.out.println("Trim: \'" + s.trim() + "\'");\n        System.out.println("Replace: " + s.replace("Java", "Drishti"));\n        System.out.println("Contains World: " + s.contains("World"));\n        System.out.println("Substring: " + s.trim().substring(0, 5));\n        \n        String fruits = "apple,banana,mango";\n        String[] arr = fruits.split(",");\n        for (String f : arr) {\n            System.out.println(f);\n        }\n    }\n}'
  },
  {
    id: 15,
    title: "Mini Project — Student Management System",
    content: "Congratulations! You have learned all the important concepts of Java. Now we will combine everything to build a Student Management System. This project uses OOP concepts including classes, objects, ArrayList, methods, and exception handling. This is a real-world style project that is also commonly asked about in interviews. The project has a Student class that holds student information. The StudentManager class has an ArrayList of students and provides methods to add, display, and search students. This project will show you how Java is used in practice. After building this you can confidently say that you have built a real Java project.",
    example: 'import java.util.ArrayList;\n\nclass Student {\n    private String name;\n    private int rollNo;\n    private double marks;\n    \n    public Student(String name, int rollNo, double marks) {\n        this.name = name;\n        this.rollNo = rollNo;\n        this.marks = marks;\n    }\n    \n    public String getName() { return name; }\n    public int getRollNo() { return rollNo; }\n    public double getMarks() { return marks; }\n    \n    public void display() {\n        System.out.println("Roll: " + rollNo + " | Name: " + name + " | Marks: " + marks);\n    }\n}\n\npublic class StudentManager {\n    ArrayList<Student> students = new ArrayList<>();\n    \n    public void addStudent(Student s) {\n        students.add(s);\n        System.out.println(s.getName() + " added successfully!");\n    }\n    \n    public void displayAll() {\n        System.out.println("=== All Students ===");\n        for (Student s : students) {\n            s.display();\n        }\n    }\n    \n    public static void main(String[] args) {\n        StudentManager mgr = new StudentManager();\n        mgr.addStudent(new Student("Sharada", 1, 92.5));\n        mgr.addStudent(new Student("Rahul", 2, 87.0));\n        mgr.addStudent(new Student("Priya", 3, 95.5));\n        mgr.displayAll();\n    }\n}'
  },
]


const javaLessonsMarathi = [
  {
    id: 1,
    title: "Java म्हणजे काय?",
    content: "Java ही एक high-level, object-oriented programming language आहे जी 1995 साली James Gosling यांनी Sun Microsystems मध्ये बनवली. Java चा सर्वात मोठा फायदा म्हणजे — Write Once, Run Anywhere. याचा अर्थ असा की तुम्ही एकदा Java मध्ये program लिहा आणि तो कोणत्याही computer वर चालू शकतो — मग ते Windows असो, Mac असो, किंवा Linux असो. हे शक्य आहे कारण Java code आधी bytecode मध्ये convert होतो आणि नंतर JVM म्हणजे Java Virtual Machine तो bytecode run करते. Java जगातील सर्वात popular programming languages पैकी एक आहे. Android apps, banking systems, आणि मोठ्या companies चे software Java मध्ये बनलेले आहेत. Google, Amazon, आणि Netflix देखील Java वापरतात. Java ही strongly typed language आहे म्हणजे प्रत्येक variable चा type आधीच declare करावा लागतो.",
    example: null
  },
  {
    id: 2,
    title: "Java चा पहिला Program",
    content: "Java मध्ये प्रत्येक program एका class च्या आत असतो. Class चे नाव आणि file चे नाव नेहमी एकसारखे असायला हवे. main method ही अशी जागा आहे जिथून program सुरू होतो. public म्हणजे हे method सर्वांसाठी accessible आहे. static म्हणजे object न बनवता call करता येते. void म्हणजे हे method कोणतीही value return करत नाही. System.out.println() ने screen वर काहीतरी print करतो. println म्हणजे print line — हे print करून नवीन ओळीवर जाते. प्रत्येक statement च्या शेवटी semicolon लावणे आवश्यक आहे. Java case-sensitive आहे म्हणजे Main आणि main वेगळे आहेत.",
    example: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("नमस्कार जग!");\n        System.out.println("माझा पहिला Java program");\n        System.out.println(2024);\n    }\n}'
  },
  {
    id: 3,
    title: "Variables आणि Data Types",
    content: "Java मध्ये variables declare करताना त्यांचा data type लिहणे आवश्यक आहे. हे Python पेक्षा वेगळे आहे जिथे type आपोआप समजतो. int ने पूर्ण संख्या store होते जसे 5, 100, -20. double ने दशांश संख्या store होते जसे 3.14, 9.99. String ने text store होतो आणि String capital S ने लिहतो. boolean ने फक्त true किंवा false store होते. char ने एकच character store होतो आणि single quotes मध्ये लिहतो. long ने खूप मोठ्या संख्या store होतात. float देखील दशांशांसाठी आहे पण double जास्त accurate असतो. Java मध्ये variable declare केल्यावर त्याची value बदलता येते पण type बदलत नाही.",
    example: 'public class Variables {\n    public static void main(String[] args) {\n        int vay = 20;\n        double unchaai = 5.9;\n        String naam = "Sharada";\n        boolean isStudent = true;\n        char grade = \'A\';\n        \n        System.out.println("नाव: " + naam);\n        System.out.println("वय: " + vay);\n        System.out.println("उंची: " + unchaai);\n        System.out.println("Student: " + isStudent);\n        System.out.println("Grade: " + grade);\n    }\n}'
  },
  {
    id: 4,
    title: "User कडून Input घेणे — Scanner",
    content: "Java मध्ये user कडून input घेण्यासाठी Scanner class वापरतो. Scanner java.util package मध्ये आहे म्हणून आधी import करावे लागते. import java.util.Scanner; लिहून Scanner program मध्ये आणतो. मग Scanner चा object बनवतो — Scanner sc = new Scanner(System.in). System.in म्हणजे keyboard मधून input घेणे. nextInt() ने integer input घेतो. nextDouble() ने decimal number घेतो. next() ने एक word घेतो. nextLine() ने पूर्ण line घेतो. Input घेण्यापूर्वी user ला सांगायला हवे की काय type करायचे म्हणून System.out.print() ने message दाखवतो. Scanner वापरून झाल्यावर sc.close() ने बंद करणे चांगली practice आहे.",
    example: 'import java.util.Scanner;\n\npublic class InputExample {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        \n        System.out.print("तुमचे नाव काय आहे? ");\n        String naam = sc.nextLine();\n        \n        System.out.print("तुमचे वय किती आहे? ");\n        int vay = sc.nextInt();\n        \n        System.out.println("नमस्कार " + naam + "!");\n        System.out.println("तुमचे वय आहे: " + vay);\n        \n        sc.close();\n    }\n}'
  },
  {
    id: 5,
    title: "If/Else Conditions",
    content: "Java मध्ये if/else ने आपण computer ला निर्णय घेण्यास शिकवतो. Java चा if/else syntax Python पेक्षा थोडा वेगळा आहे. Java मध्ये condition round brackets () मध्ये लिहतो आणि code block curly braces {} मध्ये लिहतो. जर condition true असेल तर if block चालतो, नाहीतर else block चालतो. else if ने multiple conditions check करता येतात. Comparison operators: == equal to, != not equal to, > greater than, < less than, >= greater than or equal to, <= less than or equal to. Logical operators: && म्हणजे AND, || म्हणजे OR, ! म्हणजे NOT. Java मध्ये triple equals नसतो. String compare करण्यासाठी equals() method वापरतो, == नाही.",
    example: 'public class Conditions {\n    public static void main(String[] args) {\n        int vay = 18;\n        \n        if (vay >= 18) {\n            System.out.println("तुम्ही मतदान करू शकता");\n        } else {\n            System.out.println("तुम्ही मतदान करू शकत नाही");\n        }\n        \n        int marks = 85;\n        if (marks >= 90) {\n            System.out.println("Grade: A+");\n        } else if (marks >= 75) {\n            System.out.println("Grade: A");\n        } else if (marks >= 60) {\n            System.out.println("Grade: B");\n        } else {\n            System.out.println("Grade: C");\n        }\n    }\n}'
  },
  {
    id: 6,
    title: "Loops — For आणि While",
    content: "Java मध्ये loops ने आपण एखादे काम अनेक वेळा करवतो. For loop तेव्हा वापरतो जेव्हा आपल्याला माहीत असते की loop किती वेळा चालेल. For loop मध्ये तीन parts असतात — initialization जिथे variable बनवतो, condition जी true राहेपर्यंत loop चालतो, आणि update जो प्रत्येक वेळी execute होतो. While loop तेव्हा वापरतो जेव्हा iterations condition वर अवलंबून असतात. Do-while loop किमान एकदा नक्की चालतो कारण condition नंतर check होते. break statement ने loop लगेच बंद होतो. continue statement ने current iteration skip होते आणि पुढची सुरू होते. Nested loops म्हणजे loop च्या आत loop pattern printing साठी वापरतात.",
    example: 'public class Loops {\n    public static void main(String[] args) {\n        // For loop\n        for (int i = 1; i <= 5; i++) {\n            System.out.println("Count: " + i);\n        }\n        \n        // While loop\n        int count = 1;\n        while (count <= 3) {\n            System.out.println("While: " + count);\n            count++;\n        }\n        \n        // 1 ते 10 चे squares\n        for (int i = 1; i <= 10; i++) {\n            System.out.println(i + " चा square: " + (i * i));\n        }\n    }\n}'
  },
  {
    id: 7,
    title: "Arrays",
    content: "Array म्हणजे एक container जिथे एकाच type च्या multiple values एकत्र store होतात. Java मध्ये array चा size declare करताना fix होतो, नंतर बदलता येत नाही. Array declare करण्यासाठी data type च्या नंतर [] लिहतो. new keyword ने array साठी memory allocate होते. Array चा index 0 पासून सुरू होतो. length property ने array ची size कळते. For loop ने array चे सर्व elements access करता येतात. Enhanced for loop म्हणजे for-each loop ने array iterate करणे आणखी सोपे होते. 2D array म्हणजे array of arrays ने matrix बनवता येते. Arrays.sort() ने array sort करता येतो — यासाठी java.util.Arrays import करावे लागते.",
    example: 'import java.util.Arrays;\n\npublic class ArrayExample {\n    public static void main(String[] args) {\n        int[] numbers = {10, 20, 30, 40, 50};\n        String[] fruits = {"apple", "banana", "mango"};\n        \n        System.out.println("पहिला element: " + numbers[0]);\n        System.out.println("Array ची size: " + numbers.length);\n        \n        for (String fruit : fruits) {\n            System.out.println(fruit);\n        }\n        \n        int[] scores = {85, 42, 91, 67, 78};\n        Arrays.sort(scores);\n        System.out.println("Sorted: " + Arrays.toString(scores));\n    }\n}'
  },
  {
    id: 8,
    title: "Methods (Functions)",
    content: "Java मध्ये functions ला methods म्हणतात आणि ते नेहमी कोणत्यातरी class च्या आत असतात. Method declaration मध्ये access modifier, return type, method name, आणि parameters असतात. public म्हणजे सर्वांसाठी accessible. static म्हणजे object न बनवता call करता येते. Return type सांगतो की method काय return करेल — जर काही return करायचे नसेल तर void लिहतो. Parameters म्हणजे त्या values ज्या method ला दिल्या जातात. return keyword ने value परत मिळते. Method overloading म्हणजे same नावाचे multiple methods पण वेगवेगळे parameters. हे Java चे एक powerful feature आहे. Recursion म्हणजे method चे स्वतःला call करणे देखील Java मध्ये शक्य आहे.",
    example: 'public class Methods {\n    public static void namaskaar(String naam) {\n        System.out.println("नमस्कार " + naam + "!");\n    }\n    \n    public static int add(int a, int b) {\n        return a + b;\n    }\n    \n    public static double add(double a, double b) {\n        return a + b;\n    }\n    \n    public static void main(String[] args) {\n        namaskaar("Sharada");\n        namaskaar("Pyra");\n        \n        System.out.println("5 + 3 = " + add(5, 3));\n        System.out.println("2.5 + 1.5 = " + add(2.5, 1.5));\n    }\n}'
  },
  {
    id: 9,
    title: "Object-Oriented Programming — Classes आणि Objects",
    content: "Java ही object-oriented language आहे आणि OOP हा तिचा सर्वात महत्त्वाचा concept आहे. Real world मध्ये सर्व काही objects आहेत — car, student, bank account. Class म्हणजे एक blueprint किंवा template जी सांगते की object मध्ये कोणता data आणि कोणते behavior असेल. Object म्हणजे त्या class चा एक instance. Class मध्ये दोन गोष्टी असतात — fields म्हणजे data variables आणि methods म्हणजे behavior functions. Constructor म्हणजे एक special method जो object बनवताना automatically call होतो. Constructor चे नाव class च्या नावासारखे असते आणि त्याचा कोणताही return type नसतो. new keyword ने object बनवतो. Dot operator ने object चे fields आणि methods access करतो.",
    example: 'public class Student {\n    String naam;\n    int vay;\n    double marks;\n    \n    public Student(String naam, int vay, double marks) {\n        this.naam = naam;\n        this.vay = vay;\n        this.marks = marks;\n    }\n    \n    public void displayInfo() {\n        System.out.println("नाव: " + naam);\n        System.out.println("वय: " + vay);\n        System.out.println("Marks: " + marks);\n    }\n    \n    public static void main(String[] args) {\n        Student s1 = new Student("Sharada", 20, 92.5);\n        Student s2 = new Student("Rahul", 22, 87.0);\n        \n        s1.displayInfo();\n        System.out.println("---");\n        s2.displayInfo();\n    }\n}'
  },
  {
    id: 10,
    title: "Encapsulation — Data लपवणे",
    content: "Encapsulation हे OOP चे एक महत्त्वाचे principle आहे. याचा अर्थ class मधील data ला direct access पासून protect करणे. याला data hiding देखील म्हणतात. Encapsulation मध्ये fields ला private बनवतो जेणेकरून बाहेरून direct access होणार नाही. Private fields access करण्यासाठी public getter आणि setter methods बनवतो. Getter method ने field ची value वाचतो आणि setter method ने value set करतो. यामुळे data validation शक्य होते — setter मध्ये check करता येते की value valid आहे की नाही. उदाहरणार्थ age setter मध्ये check करता येते की age negative तर नाही. Encapsulation मुळे code maintainable आणि secure होतो. Real-world projects मध्ये हे अत्यंत आवश्यक आहे.",
    example: 'public class BankAccount {\n    private String owner;\n    private double balance;\n    \n    public BankAccount(String owner, double balance) {\n        this.owner = owner;\n        this.balance = balance;\n    }\n    \n    public double getBalance() {\n        return balance;\n    }\n    \n    public void deposit(double amount) {\n        if (amount > 0) {\n            balance += amount;\n            System.out.println(amount + " जमा झाले. नवीन balance: " + balance);\n        } else {\n            System.out.println("Invalid amount!");\n        }\n    }\n    \n    public void withdraw(double amount) {\n        if (amount > 0 && amount <= balance) {\n            balance -= amount;\n            System.out.println(amount + " काढले. नवीन balance: " + balance);\n        } else {\n            System.out.println("Insufficient balance!");\n        }\n    }\n    \n    public static void main(String[] args) {\n        BankAccount acc = new BankAccount("Sharada", 5000);\n        acc.deposit(2000);\n        acc.withdraw(1500);\n        System.out.println("Balance: " + acc.getBalance());\n    }\n}'
  },
  {
    id: 11,
    title: "Inheritance — वारसा",
    content: "Inheritance हे OOP चे आणखी एक महत्त्वाचे concept आहे. यात एक class दुसऱ्या class चे properties आणि methods inherit करू शकते. जी class inherit करते तिला child class किंवा subclass म्हणतात. ज्या class मधून inherit होते तिला parent class किंवा superclass म्हणतात. extends keyword ने inheritance होते. Child class parent class चे सर्व public आणि protected members वापरू शकते. Child class स्वतःचे नवीन methods आणि fields देखील add करू शकते. Method overriding मध्ये child class parent class च्या method ला स्वतःच्या पद्धतीने redefine करते. @Override annotation ने सांगतो की हे method override होत आहे. super keyword ने parent class चे constructor आणि methods access करतो.",
    example: 'class Animal {\n    String naam;\n    \n    public Animal(String naam) {\n        this.naam = naam;\n    }\n    \n    public void sound() {\n        System.out.println(naam + " काहीतरी आवाज करतो");\n    }\n}\n\npublic class Dog extends Animal {\n    String breed;\n    \n    public Dog(String naam, String breed) {\n        super(naam);\n        this.breed = breed;\n    }\n    \n    @Override\n    public void sound() {\n        System.out.println(naam + " भुंकतो: Woof!");\n    }\n    \n    public void fetch() {\n        System.out.println(naam + " ball आणतो!");\n    }\n    \n    public static void main(String[] args) {\n        Dog d = new Dog("Tommy", "Labrador");\n        d.sound();\n        d.fetch();\n    }\n}'
  },
  {
    id: 12,
    title: "ArrayList आणि Collections",
    content: "Java मध्ये Array चा size fixed असतो पण ArrayList चा size dynamic असतो — गरजेनुसार वाढतो. ArrayList java.util package मध्ये आहे म्हणून import करावे लागते. ArrayList मध्ये objects store होतात म्हणून int च्या जागी Integer, double च्या जागी Double लिहतो — यांना Wrapper classes म्हणतात. add() ने element add होतो. get(index) ने element access होतो. remove(index) ने element हटतो. size() ने ArrayList ची size कळते. contains() ने check होते की element आहे का नाही. for-each loop ने सर्व elements iterate करता येतात. Collections.sort() ने ArrayList sort होते. ArrayList real projects मध्ये खूप उपयुक्त आहे कारण आपल्याला नेहमी dynamic size ची list हवी असते.",
    example: 'import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class ArrayListExample {\n    public static void main(String[] args) {\n        ArrayList<String> fruits = new ArrayList<>();\n        \n        fruits.add("Apple");\n        fruits.add("Banana");\n        fruits.add("Mango");\n        fruits.add("Orange");\n        \n        System.out.println("Fruits: " + fruits);\n        System.out.println("Size: " + fruits.size());\n        System.out.println("पहिला: " + fruits.get(0));\n        \n        fruits.remove("Banana");\n        System.out.println("Remove नंतर: " + fruits);\n        \n        Collections.sort(fruits);\n        System.out.println("Sorted: " + fruits);\n        \n        for (String fruit : fruits) {\n            System.out.println("- " + fruit);\n        }\n    }\n}'
  },
  {
    id: 13,
    title: "Exception Handling",
    content: "Exception म्हणजे एक error जी program चालताना येते आणि program crash करते. Java मध्ये Exception handling ने आपण या errors ला gracefully handle करतो जेणेकरून program अचानक बंद होणार नाही. try block मध्ये तो code लिहतो ज्यात exception येऊ शकते. catch block मध्ये exception handle करतो. finally block चा code नेहमी चालतो, exception आली असो किंवा नसो, आणि cleanup साठी वापरतो. Multiple catch blocks ने वेगवेगळ्या exceptions handle करता येतात. ArithmeticException zero ने divide केल्यावर येते. ArrayIndexOutOfBoundsException चुकीचा index access केल्यावर येते. NumberFormatException invalid string ला number मध्ये convert करताना येते. NullPointerException null object वर operation केल्यावर येते.",
    example: 'public class ExceptionExample {\n    public static void main(String[] args) {\n        try {\n            int result = 10 / 0;\n            System.out.println(result);\n        } catch (ArithmeticException e) {\n            System.out.println("Error: " + e.getMessage());\n        } finally {\n            System.out.println("हे नेहमी चालते");\n        }\n        \n        try {\n            int num = Integer.parseInt("hello");\n        } catch (NumberFormatException e) {\n            System.out.println("Invalid number format!");\n        }\n        \n        try {\n            int[] arr = {1, 2, 3};\n            System.out.println(arr[10]);\n        } catch (ArrayIndexOutOfBoundsException e) {\n            System.out.println("Array index out of bounds!");\n        }\n    }\n}'
  },
  {
    id: 14,
    title: "String Methods",
    content: "Java मध्ये String ही एक class आहे आणि त्यात खूप सारे useful methods असतात. length() ने string ची length कळते. charAt(index) ने specific position चा character मिळतो. substring(start, end) ने string चा भाग काढतो. toLowerCase() आणि toUpperCase() ने case बदलतो. trim() ने string च्या सुरुवातीचे आणि शेवटचे spaces हटतात. replace(old, new) ने characters किंवा substrings replace होतात. contains() ने check होते की string मध्ये कोणती substring आहे का. startsWith() आणि endsWith() ने string ची सुरुवात आणि शेवट check होतो. split() ने string चे parts केले जातात. equals() ने string comparison होते. Java मध्ये Strings immutable असतात म्हणजे एकदा बनल्यावर बदलत नाहीत, नवीन String object बनतो.",
    example: 'public class StringMethods {\n    public static void main(String[] args) {\n        String s = "  Hello World Java  ";\n        \n        System.out.println("Length: " + s.trim().length());\n        System.out.println("Uppercase: " + s.toUpperCase());\n        System.out.println("Lowercase: " + s.toLowerCase());\n        System.out.println("Trim: \'" + s.trim() + "\'");\n        System.out.println("Replace: " + s.replace("Java", "Drishti"));\n        System.out.println("Contains World: " + s.contains("World"));\n        System.out.println("Substring: " + s.trim().substring(0, 5));\n        \n        String fruits = "apple,banana,mango";\n        String[] arr = fruits.split(",");\n        for (String f : arr) {\n            System.out.println(f);\n        }\n    }\n}'
  },
  {
    id: 15,
    title: "Mini Project — Student Management System",
    content: "शाब्बास! तुम्ही Java चे सर्व महत्त्वाचे concepts शिकलात. आता आपण हे सर्व एकत्र करून एक Student Management System बनवूया. या project मध्ये आपण OOP concepts वापरू — class, objects, ArrayList, methods, आणि exception handling. हे एक real-world सारखे project आहे जे interviews मध्ये देखील विचारले जाते. या project मध्ये Student class असेल जिथे student ची information असेल. StudentManager class मध्ये students ची ArrayList असेल आणि add, display, आणि search करण्याचे methods असतील. हे project तुम्हाला Java चा practical use समजवेल. हे बनवल्यावर तुम्ही म्हणू शकता की मी Java मध्ये एक real project बनवला आहे.",
    example: 'import java.util.ArrayList;\n\nclass Student {\n    private String naam;\n    private int rollNo;\n    private double marks;\n    \n    public Student(String naam, int rollNo, double marks) {\n        this.naam = naam;\n        this.rollNo = rollNo;\n        this.marks = marks;\n    }\n    \n    public String getNaam() { return naam; }\n    public int getRollNo() { return rollNo; }\n    public double getMarks() { return marks; }\n    \n    public void display() {\n        System.out.println("Roll: " + rollNo + " | नाव: " + naam + " | Marks: " + marks);\n    }\n}\n\npublic class StudentManager {\n    ArrayList<Student> students = new ArrayList<>();\n    \n    public void addStudent(Student s) {\n        students.add(s);\n        System.out.println(s.getNaam() + " यशस्वीरित्या add झाले!");\n    }\n    \n    public void displayAll() {\n        System.out.println("=== सर्व Students ===");\n        for (Student s : students) {\n            s.display();\n        }\n    }\n    \n    public static void main(String[] args) {\n        StudentManager mgr = new StudentManager();\n        mgr.addStudent(new Student("Sharada", 1, 92.5));\n        mgr.addStudent(new Student("Rahul", 2, 87.0));\n        mgr.addStudent(new Student("Priya", 3, 95.5));\n        mgr.displayAll();\n    }\n}'
  },
]

const cppLessons = [
  {
    id: 1,
    title: "C++ क्या है?",
    content: "C++ एक powerful, general-purpose programming language है जिसे 1979 में Bjarne Stroustrup ने Bell Labs में बनाया था। C++ को C language का extension माना जाता है। C++ का नाम इसलिए रखा गया क्योंकि C में ++ operator होता है जिसका मतलब है एक बढ़ाना — यानी C++ का मतलब है C से बेहतर। C++ एक compiled language है जो बहुत fast होती है। इसीलिए game engines जैसे Unreal Engine, operating systems, browsers, और high-performance software C++ में बने होते हैं। C++ object-oriented programming को support करती है साथ ही procedural programming भी। C++ में memory management manual होती है जिससे programmer को पूरा control मिलता है। यह industry में बहुत demand में है खासकर game development, embedded systems, और competitive programming में।",
    example: null
  },
  {
    id: 2,
    title: "C++ का पहला Program",
    content: "C++ में program लिखने के लिए सबसे पहले header files include करते हैं। iostream header file input और output के लिए जरूरी है। #include<iostream> से iostream library को program में लाते हैं। using namespace std; लिखने से हर बार std:: लिखने की जरूरत नहीं पड़ती। main() function वो जगह है जहाँ से program execution शुरू होती है। int main() इसलिए लिखते हैं क्योंकि main function एक integer return करता है। cout से output देते हैं — cout का मतलब है console output। << operator से cout को data देते हैं। endl से नई line जाते हैं। return 0 से program सफलतापूर्वक खत्म होने का signal मिलता है। हर statement के अंत में semicolon जरूरी है।",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    cout << "नमस्ते दुनिया!" << endl;\n    cout << "मेरा पहला C++ program" << endl;\n    cout << 2024 << endl;\n    return 0;\n}'
  },
  {
    id: 3,
    title: "Variables और Data Types",
    content: "C++ में variables declare करते समय data type लिखना जरूरी है। int से पूरी संख्या store होती है जैसे 5, -10, 100। float से दशमलव संख्या store होती है जैसे 3.14। double से और ज्यादा accurate दशमलव संख्या store होती है। char से एक character store होता है जो single quotes में लिखते हैं। bool से true या false store होता है। string से text store होता है — इसके लिए string header या iostream जरूरी है। long long से बहुत बड़ी संख्या store होती है। unsigned int से सिर्फ positive numbers store होते हैं। C++ में variable declare करके बाद में value assign कर सकते हैं या declaration के साथ भी। const keyword से constant variable बनाते हैं जिसकी value बदल नहीं सकती।",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nint main() {\n    int umar = 20;\n    float height = 5.9f;\n    double pi = 3.14159;\n    char grade = \'A\';\n    bool isStudent = true;\n    string naam = "Sharada";\n    const int MAX = 100;\n    \n    cout << "नाम: " << naam << endl;\n    cout << "उम्र: " << umar << endl;\n    cout << "Height: " << height << endl;\n    cout << "Grade: " << grade << endl;\n    cout << "Student: " << isStudent << endl;\n    return 0;\n}'
  },
  {
    id: 4,
    title: "User से Input लेना — cin",
    content: "C++ में user से input लेने के लिए cin use करते हैं। cin का मतलब है console input। >> operator से cin को variable देते हैं। cin से integer, float, double, char — सभी types का input ले सकते हैं। string input लेने के लिए getline() function use करते हैं क्योंकि cin >> string सिर्फ पहला word लेता है। getline(cin, variable) से पूरी line लेते हैं। Input लेने से पहले user को message दिखाते हैं cout से। Multiple values एक साथ भी cin से ले सकते हैं। cin.ignore() से newline character को ignore करते हैं — यह getline से पहले जरूरी होता है जब पहले cin >> use हुआ हो। C++ में input/output बहुत fast होता है जो competitive programming में फायदेमंद है।",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nint main() {\n    string naam;\n    int umar;\n    float marks;\n    \n    cout << "आपका नाम क्या है? ";\n    getline(cin, naam);\n    \n    cout << "आपकी उम्र क्या है? ";\n    cin >> umar;\n    \n    cout << "आपके marks क्या हैं? ";\n    cin >> marks;\n    \n    cout << "नमस्ते " << naam << "!" << endl;\n    cout << "उम्र: " << umar << endl;\n    cout << "Marks: " << marks << endl;\n    \n    return 0;\n}'
  },
  {
    id: 5,
    title: "If/Else Conditions",
    content: "C++ में if/else से decision making होती है। Syntax Java जैसा ही है — condition round brackets में और code block curly braces में। अगर condition true है तो if block चलता है नहीं तो else block। else if से multiple conditions check कर सकते हैं। Comparison operators: == equal, != not equal, > greater than, < less than, >= greater than or equal, <= less than or equal। Logical operators: && AND, || OR, ! NOT। Ternary operator एक shorthand है — condition ? value_if_true : value_if_false। Switch statement से multiple cases efficiently handle होते हैं। Switch में हर case के बाद break लगाना जरूरी है नहीं तो fall-through होगा यानी सभी cases चलते रहेंगे। Default case वो होता है जब कोई case match न हो।",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    int umar = 18;\n    \n    if (umar >= 18) {\n        cout << "आप vote कर सकते हैं" << endl;\n    } else {\n        cout << "आप vote नहीं कर सकते" << endl;\n    }\n    \n    int marks = 85;\n    if (marks >= 90) {\n        cout << "Grade: A+" << endl;\n    } else if (marks >= 75) {\n        cout << "Grade: A" << endl;\n    } else if (marks >= 60) {\n        cout << "Grade: B" << endl;\n    } else {\n        cout << "Grade: C" << endl;\n    }\n    \n    // Ternary operator\n    string result = (marks >= 60) ? "Pass" : "Fail";\n    cout << "Result: " << result << endl;\n    \n    return 0;\n}'
  },
  {
    id: 6,
    title: "Loops — For, While, Do-While",
    content: "C++ में तीन प्रकार के loops होते हैं। For loop तब use करते हैं जब पता हो कितनी बार loop चलेगा। For loop में initialization, condition, और update तीनों parts होते हैं। While loop तब use करते हैं जब condition पर depend करना हो। Do-while loop कम से कम एक बार जरूर चलता है। Range-based for loop C++11 से आया जो arrays और containers को easily iterate करता है। break statement से loop तुरंत बंद होता है। continue statement से current iteration skip होती है। Nested loops से 2D patterns बनाते हैं। C++ में loops बहुत fast होते हैं क्योंकि directly machine code में compile होते हैं।",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    // For loop\n    for (int i = 1; i <= 5; i++) {\n        cout << "Count: " << i << endl;\n    }\n    \n    // While loop\n    int count = 1;\n    while (count <= 3) {\n        cout << "While: " << count << endl;\n        count++;\n    }\n    \n    // Do-while loop\n    int n = 1;\n    do {\n        cout << "Do-While: " << n << endl;\n        n++;\n    } while (n <= 3);\n    \n    // 1 से 10 तक squares\n    for (int i = 1; i <= 10; i++) {\n        cout << i << " का square: " << i*i << endl;\n    }\n    \n    return 0;\n}'
  },
  {
    id: 7,
    title: "Functions",
    content: "C++ में functions reusable code blocks होते हैं। Function को use करने से पहले declare या define करना जरूरी है। Function declaration में return type, name, और parameters होते हैं। void return type का मतलब है function कुछ return नहीं करता। Return keyword से value वापस मिलती है। Function overloading में same name के multiple functions हो सकते हैं different parameters के साथ। Default parameters से function call करते समय कुछ arguments skip कर सकते हैं। Inline functions small functions के लिए use होते हैं जो fast execution देते हैं। Recursive functions खुद को call करते हैं जैसे factorial निकालना। Pass by value में function को copy मिलती है। Pass by reference में actual variable मिलता है।",
    example: '#include<iostream>\nusing namespace std;\n\n// Function declaration\nvoid greet(string naam);\nint add(int a, int b);\nint factorial(int n);\n\nint main() {\n    greet("Sharada");\n    cout << "5 + 3 = " << add(5, 3) << endl;\n    cout << "5! = " << factorial(5) << endl;\n    return 0;\n}\n\nvoid greet(string naam) {\n    cout << "नमस्ते " << naam << "!" << endl;\n}\n\nint add(int a, int b) {\n    return a + b;\n}\n\n// Recursive function\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}'
  },
  {
    id: 8,
    title: "Arrays",
    content: "C++ में array एक fixed-size container है जिसमें same type के multiple values store होते हैं। Array declare करते समय size specify करना जरूरी है। Index 0 से शुरू होता है। Array का size बाद में change नहीं होता। sizeof() operator से array का size bytes में मिलता है। 2D array से matrix बनाते हैं। Array को functions में pass कर सकते हैं। C++ में array bounds check नहीं होती यानी गलत index access करने पर undefined behavior होता है — यह एक common bug है। String actually characters का array होता है C style में। Modern C++ में array के बजाय vector use करना बेहतर है क्योंकि vector dynamic size का होता है। Array sorting के लिए sort() algorithm use होता है।",
    example: '#include<iostream>\n#include<algorithm>\nusing namespace std;\n\nint main() {\n    // 1D Array\n    int numbers[5] = {10, 20, 30, 40, 50};\n    \n    cout << "पहला element: " << numbers[0] << endl;\n    cout << "Array size: " << 5 << endl;\n    \n    // Array iterate करें\n    for (int i = 0; i < 5; i++) {\n        cout << numbers[i] << " ";\n    }\n    cout << endl;\n    \n    // Sort करें\n    int scores[] = {85, 42, 91, 67, 78};\n    sort(scores, scores + 5);\n    \n    cout << "Sorted: ";\n    for (int i = 0; i < 5; i++) {\n        cout << scores[i] << " ";\n    }\n    cout << endl;\n    \n    return 0;\n}'
  },
  {
    id: 9,
    title: "Pointers — C++ की Special Feature",
    content: "Pointer C++ की सबसे unique और powerful feature है जो इसे दूसरी languages से अलग बनाती है। Pointer एक variable है जो किसी दूसरे variable का memory address store करता है। & operator से किसी variable का address मिलता है। * operator से pointer को declare करते हैं और pointer की value access करते हैं इसे dereferencing कहते हैं। Pointers से directly memory को access और manipulate कर सकते हैं। Dynamic memory allocation में pointers का use होता है — new से memory allocate करते हैं और delete से free करते हैं। Array का नाम actually first element का pointer होता है। Functions में pointers pass करके original value change कर सकते हैं। Null pointer वो pointer है जो कहीं point नहीं करता। Dangling pointer वो pointer है जिसकी memory free हो चुकी है।",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    int x = 42;\n    int* ptr = &x;  // ptr stores address of x\n    \n    cout << "x की value: " << x << endl;\n    cout << "x का address: " << &x << endl;\n    cout << "ptr में address: " << ptr << endl;\n    cout << "ptr से value: " << *ptr << endl;\n    \n    // Pointer से value change करें\n    *ptr = 100;\n    cout << "बाद में x: " << x << endl;\n    \n    // Dynamic memory\n    int* dynArr = new int[3];\n    dynArr[0] = 10;\n    dynArr[1] = 20;\n    dynArr[2] = 30;\n    \n    for (int i = 0; i < 3; i++) {\n        cout << dynArr[i] << " ";\n    }\n    \n    delete[] dynArr;  // Memory free करें\n    return 0;\n}'
  },
  {
    id: 10,
    title: "Classes और Objects — OOP",
    content: "C++ में object-oriented programming के लिए classes use होती हैं। Class एक blueprint है और object उसका instance है। Class में data members यानी variables और member functions यानी methods होते हैं। Access specifiers तीन होते हैं — public जो सबके लिए accessible है, private जो सिर्फ class के अंदर accessible है, और protected जो child classes के लिए accessible है। Constructor class के नाम जैसा होता है और object बनाते समय automatically call होता है। Destructor का नाम ~ के साथ class name होता है और object destroy होने पर call होता है — यह memory cleanup करता है। this pointer current object को refer करता है। Struct और class में फर्क यह है कि struct के members default public होते हैं।",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nclass Student {\nprivate:\n    string naam;\n    int umar;\n    double marks;\n    \npublic:\n    // Constructor\n    Student(string n, int u, double m) {\n        naam = n;\n        umar = u;\n        marks = m;\n    }\n    \n    // Destructor\n    ~Student() {\n        cout << naam << " का object delete हुआ" << endl;\n    }\n    \n    void displayInfo() {\n        cout << "नाम: " << naam << endl;\n        cout << "उम्र: " << umar << endl;\n        cout << "Marks: " << marks << endl;\n    }\n    \n    double getMarks() { return marks; }\n};\n\nint main() {\n    Student s1("Sharada", 20, 92.5);\n    Student s2("Rahul", 22, 87.0);\n    \n    s1.displayInfo();\n    cout << "---" << endl;\n    s2.displayInfo();\n    \n    return 0;\n}'
  },
  {
    id: 11,
    title: "Inheritance और Polymorphism",
    content: "C++ में inheritance से एक class दूसरी class के features inherit कर सकती है। Syntax में class ChildClass : access_specifier ParentClass लिखते हैं। public inheritance सबसे common है। Child class parent के public और protected members use कर सकती है। Method overriding में child class parent के method को redefine करती है। Polymorphism का मतलब है एक ही interface से multiple behaviors। Virtual functions से runtime polymorphism होती है। virtual keyword से function को virtual बनाते हैं। Override keyword C++11 से आया। Pure virtual functions abstract class बनाते हैं जिसे = 0 से define करते हैं। Abstract class का object नहीं बन सकता। Multiple inheritance C++ में possible है — एक class एक से ज्यादा classes से inherit कर सकती है।",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nclass Animal {\npublic:\n    string naam;\n    \n    Animal(string n) : naam(n) {}\n    \n    virtual void sound() {\n        cout << naam << " कुछ आवाज़ करता है" << endl;\n    }\n};\n\nclass Dog : public Animal {\npublic:\n    Dog(string n) : Animal(n) {}\n    \n    void sound() override {\n        cout << naam << " भौंकता है: Woof!" << endl;\n    }\n    \n    void fetch() {\n        cout << naam << " ball लाता है!" << endl;\n    }\n};\n\nclass Cat : public Animal {\npublic:\n    Cat(string n) : Animal(n) {}\n    \n    void sound() override {\n        cout << naam << " म्याऊ करती है: Meow!" << endl;\n    }\n};\n\nint main() {\n    Animal* a1 = new Dog("Tommy");\n    Animal* a2 = new Cat("Kitty");\n    \n    a1->sound();  // Polymorphism\n    a2->sound();\n    \n    delete a1;\n    delete a2;\n    return 0;\n}'
  },
  {
    id: 12,
    title: "STL — Vector और Map",
    content: "STL यानी Standard Template Library C++ की बहुत powerful feature है। STL में ready-made data structures और algorithms होते हैं। Vector dynamic array है जो automatically size बढ़ाता है। push_back() से element add होता है। pop_back() से last element remove होता है। size() से size पता चलती है। at() या [] से element access होता है। Map key-value pairs store करता है जहाँ keys automatically sorted रहती हैं। Map में insert करने के लिए [] operator use होता है। find() से key search होती है। Set unique values store करता है। Queue और Stack भी STL में होते हैं। sort() algorithm से vector sort होता है। STL use करने से code छोटा और efficient बनता है।",
    example: '#include<iostream>\n#include<vector>\n#include<map>\n#include<algorithm>\nusing namespace std;\n\nint main() {\n    // Vector\n    vector<int> nums = {5, 2, 8, 1, 9};\n    nums.push_back(4);\n    \n    sort(nums.begin(), nums.end());\n    \n    cout << "Sorted vector: ";\n    for (int n : nums) {\n        cout << n << " ";\n    }\n    cout << endl;\n    \n    // Map\n    map<string, int> marks;\n    marks["Sharada"] = 92;\n    marks["Rahul"] = 87;\n    marks["Priya"] = 95;\n    \n    cout << "\\nMarks:" << endl;\n    for (auto& pair : marks) {\n        cout << pair.first << ": " << pair.second << endl;\n    }\n    \n    return 0;\n}'
  },
  {
    id: 13,
    title: "File Handling",
    content: "C++ में files read और write करने के लिए fstream library use होती है। fstream header file include करनी पड़ती है। ofstream से file में write करते हैं — o का मतलब output। ifstream से file से read करते हैं — i का मतलब input। fstream से दोनों read और write कर सकते हैं। File open करने के लिए object बनाते हैं और file name देते हैं। is_open() से check करते हैं कि file successfully open हुई या नहीं। << operator से file में write होता है जैसे cout में। >> या getline() से file से read होता है। close() से file बंद करते हैं — यह जरूरी है। ios::app mode से file के अंत में data add होता है बिना पुराना data delete किए। Binary mode में files को binary format में read/write करते हैं।",
    example: '#include<iostream>\n#include<fstream>\n#include<string>\nusing namespace std;\n\nint main() {\n    // File में write करें\n    ofstream outFile("students.txt");\n    \n    if (outFile.is_open()) {\n        outFile << "Sharada,92" << endl;\n        outFile << "Rahul,87" << endl;\n        outFile << "Priya,95" << endl;\n        outFile.close();\n        cout << "File successfully लिखी!" << endl;\n    }\n    \n    // File से read करें\n    ifstream inFile("students.txt");\n    string line;\n    \n    cout << "\\nFile का content:" << endl;\n    if (inFile.is_open()) {\n        while (getline(inFile, line)) {\n            cout << line << endl;\n        }\n        inFile.close();\n    }\n    \n    return 0;\n}'
  },
  {
    id: 14,
    title: "Templates और Generic Programming",
    content: "Templates C++ की एक advanced feature है जो generic programming enable करती है। Template से ऐसे functions और classes बना सकते हैं जो किसी भी data type के साथ काम करें। Function template में template<typename T> लिखते हैं जहाँ T एक placeholder है किसी भी type के लिए। जब function call होता है तो compiler automatically T को actual type से replace करता है। Class templates से generic data structures बनाते हैं। STL के vector, map जैसी सभी containers templates ही हैं। Template specialization से specific type के लिए अलग implementation दे सकते हैं। Variadic templates से variable number of arguments handle होते हैं। Templates compile time पर resolve होते हैं इसलिए runtime overhead नहीं होता। यह feature C++ को बहुत flexible और reusable बनाती है।",
    example: '#include<iostream>\nusing namespace std;\n\n// Function template\ntemplate<typename T>\nT maximum(T a, T b) {\n    return (a > b) ? a : b;\n}\n\n// Class template\ntemplate<typename T>\nclass Box {\nprivate:\n    T value;\npublic:\n    Box(T v) : value(v) {}\n    T getValue() { return value; }\n    void display() {\n        cout << "Box में है: " << value << endl;\n    }\n};\n\nint main() {\n    // Function template use करें\n    cout << "Max(5, 3): " << maximum(5, 3) << endl;\n    cout << "Max(3.14, 2.71): " << maximum(3.14, 2.71) << endl;\n    cout << "Max(\'z\', \'a\'): " << maximum(\'z\', \'a\') << endl;\n    \n    // Class template use करें\n    Box<int> intBox(42);\n    Box<string> strBox("Hello");\n    Box<double> dblBox(3.14);\n    \n    intBox.display();\n    strBox.display();\n    dblBox.display();\n    \n    return 0;\n}'
  },
  {
    id: 15,
    title: "Mini Project — Student Grade Calculator",
    content: "शाबाश! आपने C++ के सभी important concepts सीख लिए। अब हम एक Student Grade Calculator बनाएंगे जो C++ की OOP, STL, और file handling features use करेगा। इस project में Student class होगी, students को vector में store करेंगे, grades calculate करेंगे, और results file में save करेंगे। यह project real-world C++ programming जैसा है। इसमें classes, objects, constructors, vectors, file I/O, और sorting सब कुछ use होगा। इस project के बाद आप confidently कह सकते हैं कि आपने C++ में एक complete project बनाया है। C++ की speed और power को इस project में महसूस करेंगे।",
    example: '#include<iostream>\n#include<vector>\n#include<string>\n#include<algorithm>\nusing namespace std;\n\nclass Student {\npublic:\n    string naam;\n    double marks;\n    string grade;\n    \n    Student(string n, double m) : naam(n), marks(m) {\n        if (m >= 90) grade = "A+";\n        else if (m >= 75) grade = "A";\n        else if (m >= 60) grade = "B";\n        else grade = "C";\n    }\n    \n    void display() {\n        cout << naam << " | Marks: " << marks << " | Grade: " << grade << endl;\n    }\n};\n\nbool compareMarks(Student& a, Student& b) {\n    return a.marks > b.marks;\n}\n\nint main() {\n    vector<Student> students;\n    \n    students.push_back(Student("Sharada", 92.5));\n    students.push_back(Student("Rahul", 87.0));\n    students.push_back(Student("Priya", 95.5));\n    students.push_back(Student("Amit", 65.0));\n    \n    // Marks के हिसाब से sort करें\n    sort(students.begin(), students.end(), compareMarks);\n    \n    cout << "=== Student Results (Rank wise) ===" << endl;\n    for (int i = 0; i < students.size(); i++) {\n        cout << "Rank " << i+1 << ": ";\n        students[i].display();\n    }\n    \n    // Average निकालें\n    double total = 0;\n    for (auto& s : students) total += s.marks;\n    cout << "\\nClass Average: " << total/students.size() << endl;\n    \n    return 0;\n}'
  },
]

const cppLessonsEnglish = [
  {
    id: 1,
    title: "What is C++?",
    content: "C++ is a powerful, general-purpose programming language created by Bjarne Stroustrup at Bell Labs in 1979. C++ is considered an extension of the C language. The name C++ comes from the ++ operator in C which means increment by one, so C++ means one better than C. C++ is a compiled language which means it runs very fast. This is why game engines like Unreal Engine, operating systems, browsers, and high-performance software are all built in C++. C++ supports both object-oriented programming and procedural programming. Memory management in C++ is manual which gives the programmer complete control. C++ is in high demand in the industry especially in game development, embedded systems, and competitive programming.",
    example: null
  },
  {
    id: 2,
    title: "First C++ Program",
    content: "To write a C++ program we first include the required header files. The iostream header file is needed for input and output operations. We write #include iostream to bring the iostream library into the program. Writing using namespace std means we do not have to write std before every command. The main() function is where program execution begins. We write int main() because the main function returns an integer. We use cout to display output on the screen. The name cout stands for console output. We use the << operator to pass data to cout. The endl keyword moves the cursor to a new line. The statement return 0 signals that the program ended successfully. Every statement must end with a semicolon.",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!" << endl;\n    cout << "My first C++ program" << endl;\n    cout << 2024 << endl;\n    return 0;\n}'
  },
  {
    id: 3,
    title: "Variables and Data Types",
    content: "In C++ you must write the data type when declaring a variable. The int type stores whole numbers like 5, -10, or 100. The float type stores decimal numbers like 3.14. The double type stores more precise decimal numbers than float. The char type stores a single character written inside single quotes. The bool type stores either true or false. The string type stores text and requires the string header or iostream. The long long type stores very large numbers. The unsigned int type stores only positive numbers. In C++ you can declare a variable first and assign a value later, or do both together. The const keyword creates a constant variable whose value cannot be changed.",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nint main() {\n    int age = 20;\n    float height = 5.9f;\n    double pi = 3.14159;\n    char grade = \'A\';\n    bool isStudent = true;\n    string name = "Sharada";\n    const int MAX = 100;\n    \n    cout << "Name: " << name << endl;\n    cout << "Age: " << age << endl;\n    cout << "Height: " << height << endl;\n    cout << "Grade: " << grade << endl;\n    cout << "Student: " << isStudent << endl;\n    return 0;\n}'
  },
  {
    id: 4,
    title: "Taking Input from User — cin",
    content: "In C++ we use cin to take input from the user. The name cin stands for console input. We use the >> operator to read data into a variable. We can use cin to read integers, floats, doubles, and characters. To read a full line of text including spaces we use the getline() function because cin >> only reads up to the first space. We write getline(cin, variable) to read the entire line. Before taking input we display a prompt to the user using cout. We can also read multiple values in one line using cin. The cin.ignore() function is used to ignore the newline character and is important to use before getline when cin >> has been used before it. Input and output in C++ is very fast which is an advantage in competitive programming.",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nint main() {\n    string name;\n    int age;\n    float marks;\n    \n    cout << "What is your name? ";\n    getline(cin, name);\n    \n    cout << "What is your age? ";\n    cin >> age;\n    \n    cout << "What are your marks? ";\n    cin >> marks;\n    \n    cout << "Hello " << name << "!" << endl;\n    cout << "Age: " << age << endl;\n    cout << "Marks: " << marks << endl;\n    \n    return 0;\n}'
  },
  {
    id: 5,
    title: "If/Else Conditions",
    content: "In C++ we use if and else for decision making. The syntax is similar to Java with the condition inside round brackets and the code block inside curly braces. If the condition is true the if block runs otherwise the else block runs. We use else if to check multiple conditions. The comparison operators are == for equal, != for not equal, > for greater than, < for less than, >= for greater than or equal, and <= for less than or equal. The logical operators are && for AND, || for OR, and ! for NOT. The ternary operator is a shorthand for if/else written as condition ? value_if_true : value_if_false. The switch statement handles multiple cases efficiently. A break statement is needed after each case otherwise fall-through occurs and all remaining cases execute. The default case handles all values that do not match any case.",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    int age = 18;\n    \n    if (age >= 18) {\n        cout << "You can vote" << endl;\n    } else {\n        cout << "You cannot vote" << endl;\n    }\n    \n    int marks = 85;\n    if (marks >= 90) {\n        cout << "Grade: A+" << endl;\n    } else if (marks >= 75) {\n        cout << "Grade: A" << endl;\n    } else if (marks >= 60) {\n        cout << "Grade: B" << endl;\n    } else {\n        cout << "Grade: C" << endl;\n    }\n    \n    string result = (marks >= 60) ? "Pass" : "Fail";\n    cout << "Result: " << result << endl;\n    \n    return 0;\n}'
  },
  {
    id: 6,
    title: "Loops — For, While, Do-While",
    content: "C++ has three types of loops. We use a for loop when we know how many times the loop should run. A for loop has three parts: initialization, condition, and update. We use a while loop when the number of iterations depends on a condition. A do-while loop always runs at least once because the condition is checked after the first execution. The range-based for loop introduced in C++11 makes it easy to iterate over arrays and containers. The break statement immediately exits the loop. The continue statement skips the current iteration and moves to the next. Nested loops are loops inside loops and are used to create 2D patterns. Loops in C++ run very fast because they compile directly to machine code.",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        cout << "Count: " << i << endl;\n    }\n    \n    int count = 1;\n    while (count <= 3) {\n        cout << "While: " << count << endl;\n        count++;\n    }\n    \n    int n = 1;\n    do {\n        cout << "Do-While: " << n << endl;\n        n++;\n    } while (n <= 3);\n    \n    for (int i = 1; i <= 10; i++) {\n        cout << i << " squared: " << i*i << endl;\n    }\n    \n    return 0;\n}'
  },
  {
    id: 7,
    title: "Functions",
    content: "In C++ functions are reusable code blocks. A function must be declared or defined before it is used. A function declaration includes the return type, the name, and the parameters. The void return type means the function does not return any value. The return keyword sends a value back to the caller. Function overloading allows multiple functions with the same name but different parameters. Default parameters let you skip certain arguments when calling a function. Inline functions are used for small functions to improve execution speed. Recursive functions call themselves and are useful for problems like calculating factorials. Pass by value gives the function a copy of the variable. Pass by reference gives the function the actual variable so changes affect the original.",
    example: '#include<iostream>\nusing namespace std;\n\nvoid greet(string name);\nint add(int a, int b);\nint factorial(int n);\n\nint main() {\n    greet("Sharada");\n    cout << "5 + 3 = " << add(5, 3) << endl;\n    cout << "5! = " << factorial(5) << endl;\n    return 0;\n}\n\nvoid greet(string name) {\n    cout << "Hello " << name << "!" << endl;\n}\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}'
  },
  {
    id: 8,
    title: "Arrays",
    content: "In C++ an array is a fixed-size container that stores multiple values of the same type. You must specify the size when declaring an array. The index starts from 0. The size of an array cannot change after declaration. The sizeof() operator returns the size of the array in bytes. A 2D array is used to represent a matrix. Arrays can be passed to functions. C++ does not check array bounds which means accessing an invalid index causes undefined behavior — this is a common bug to watch out for. A string in C style is actually an array of characters. In modern C++ it is better to use vector instead of array because vector has a dynamic size. The sort() algorithm from the algorithm header can sort an array.",
    example: '#include<iostream>\n#include<algorithm>\nusing namespace std;\n\nint main() {\n    int numbers[5] = {10, 20, 30, 40, 50};\n    \n    cout << "First element: " << numbers[0] << endl;\n    \n    for (int i = 0; i < 5; i++) {\n        cout << numbers[i] << " ";\n    }\n    cout << endl;\n    \n    int scores[] = {85, 42, 91, 67, 78};\n    sort(scores, scores + 5);\n    \n    cout << "Sorted: ";\n    for (int i = 0; i < 5; i++) {\n        cout << scores[i] << " ";\n    }\n    cout << endl;\n    \n    return 0;\n}'
  },
  {
    id: 9,
    title: "Pointers — C++ Special Feature",
    content: "A pointer is one of the most unique and powerful features of C++ and it is what sets it apart from other languages. A pointer is a variable that stores the memory address of another variable. The & operator gives us the address of a variable. The * operator is used to declare a pointer and also to access the value stored at the address the pointer points to, which is called dereferencing. With pointers we can directly access and manipulate memory. Pointers are used in dynamic memory allocation where we use new to allocate memory and delete to free it. The name of an array is actually a pointer to its first element. Passing a pointer to a function allows the function to change the original variable. A null pointer does not point to anything. A dangling pointer points to memory that has already been freed.",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    int x = 42;\n    int* ptr = &x;\n    \n    cout << "Value of x: " << x << endl;\n    cout << "Address of x: " << &x << endl;\n    cout << "Address in ptr: " << ptr << endl;\n    cout << "Value via ptr: " << *ptr << endl;\n    \n    *ptr = 100;\n    cout << "x after change: " << x << endl;\n    \n    int* dynArr = new int[3];\n    dynArr[0] = 10;\n    dynArr[1] = 20;\n    dynArr[2] = 30;\n    \n    for (int i = 0; i < 3; i++) {\n        cout << dynArr[i] << " ";\n    }\n    \n    delete[] dynArr;\n    return 0;\n}'
  },
  {
    id: 10,
    title: "Classes and Objects — OOP",
    content: "In C++ we use classes for object-oriented programming. A class is a blueprint and an object is an instance of that class. A class contains data members which are variables and member functions which are methods. There are three access specifiers: public which is accessible to everyone, private which is only accessible inside the class, and protected which is accessible to child classes. A constructor has the same name as the class and is automatically called when an object is created. A destructor has the class name prefixed with ~ and is called when an object is destroyed. It is used for memory cleanup. The this pointer refers to the current object. The difference between a struct and a class in C++ is that struct members are public by default.",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nclass Student {\nprivate:\n    string name;\n    int age;\n    double marks;\n    \npublic:\n    Student(string n, int a, double m) {\n        name = n;\n        age = a;\n        marks = m;\n    }\n    \n    ~Student() {\n        cout << name << " object deleted" << endl;\n    }\n    \n    void displayInfo() {\n        cout << "Name: " << name << endl;\n        cout << "Age: " << age << endl;\n        cout << "Marks: " << marks << endl;\n    }\n    \n    double getMarks() { return marks; }\n};\n\nint main() {\n    Student s1("Sharada", 20, 92.5);\n    Student s2("Rahul", 22, 87.0);\n    \n    s1.displayInfo();\n    cout << "---" << endl;\n    s2.displayInfo();\n    \n    return 0;\n}'
  },
  {
    id: 11,
    title: "Inheritance and Polymorphism",
    content: "In C++ one class can inherit features from another class using inheritance. The syntax is class ChildClass colon access_specifier ParentClass. Public inheritance is the most common type. The child class can use the public and protected members of the parent class. Method overriding is when the child class redefines a method from the parent class. Polymorphism means one interface with multiple behaviors. Virtual functions enable runtime polymorphism. We use the virtual keyword to make a function virtual. The override keyword was introduced in C++11 to explicitly mark overridden functions. Pure virtual functions are declared with = 0 and create abstract classes. An abstract class cannot be instantiated. Multiple inheritance is possible in C++ meaning one class can inherit from more than one class.",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nclass Animal {\npublic:\n    string name;\n    Animal(string n) : name(n) {}\n    virtual void sound() {\n        cout << name << " makes a sound" << endl;\n    }\n};\n\nclass Dog : public Animal {\npublic:\n    Dog(string n) : Animal(n) {}\n    void sound() override {\n        cout << name << " barks: Woof!" << endl;\n    }\n    void fetch() {\n        cout << name << " fetches the ball!" << endl;\n    }\n};\n\nclass Cat : public Animal {\npublic:\n    Cat(string n) : Animal(n) {}\n    void sound() override {\n        cout << name << " meows: Meow!" << endl;\n    }\n};\n\nint main() {\n    Animal* a1 = new Dog("Tommy");\n    Animal* a2 = new Cat("Kitty");\n    a1->sound();\n    a2->sound();\n    delete a1;\n    delete a2;\n    return 0;\n}'
  },
  {
    id: 12,
    title: "STL — Vector and Map",
    content: "STL which stands for Standard Template Library is one of the most powerful features of C++. STL provides ready-made data structures and algorithms. Vector is a dynamic array that automatically grows in size. We use push_back() to add an element, pop_back() to remove the last element, size() to get the size, and [] or at() to access elements. Map stores key-value pairs where the keys are automatically sorted. We use the [] operator to insert into a map. The find() method searches for a key. Set stores only unique values. Queue and Stack are also available in STL. The sort() algorithm sorts a vector. Using STL makes code shorter and more efficient and it is used in almost every professional C++ project.",
    example: '#include<iostream>\n#include<vector>\n#include<map>\n#include<algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {5, 2, 8, 1, 9};\n    nums.push_back(4);\n    sort(nums.begin(), nums.end());\n    \n    cout << "Sorted vector: ";\n    for (int n : nums) {\n        cout << n << " ";\n    }\n    cout << endl;\n    \n    map<string, int> marks;\n    marks["Sharada"] = 92;\n    marks["Rahul"] = 87;\n    marks["Priya"] = 95;\n    \n    cout << "\\nMarks:" << endl;\n    for (auto& pair : marks) {\n        cout << pair.first << ": " << pair.second << endl;\n    }\n    \n    return 0;\n}'
  },
  {
    id: 13,
    title: "File Handling",
    content: "In C++ we use the fstream library to read from and write to files. We must include the fstream header file. The ofstream class is used to write to a file where o stands for output. The ifstream class is used to read from a file where i stands for input. The fstream class can do both reading and writing. To open a file we create an object and pass the file name. We use is_open() to check whether the file opened successfully. We use the << operator to write to a file just like with cout. We use >> or getline() to read from a file. We must call close() when we are done with the file. The ios::app mode appends data to the end of a file without deleting existing content. Binary mode is used to read and write files in binary format.",
    example: '#include<iostream>\n#include<fstream>\n#include<string>\nusing namespace std;\n\nint main() {\n    ofstream outFile("students.txt");\n    \n    if (outFile.is_open()) {\n        outFile << "Sharada,92" << endl;\n        outFile << "Rahul,87" << endl;\n        outFile << "Priya,95" << endl;\n        outFile.close();\n        cout << "File written successfully!" << endl;\n    }\n    \n    ifstream inFile("students.txt");\n    string line;\n    \n    cout << "\\nFile contents:" << endl;\n    if (inFile.is_open()) {\n        while (getline(inFile, line)) {\n            cout << line << endl;\n        }\n        inFile.close();\n    }\n    \n    return 0;\n}'
  },
  {
    id: 14,
    title: "Templates and Generic Programming",
    content: "Templates are an advanced feature of C++ that enable generic programming. With templates we can write functions and classes that work with any data type. In a function template we write template typename T where T is a placeholder for any type. When the function is called the compiler automatically replaces T with the actual type being used. Class templates let us create generic data structures. All the containers in STL like vector and map are templates. Template specialization allows a different implementation for a specific type. Variadic templates handle a variable number of arguments. Templates are resolved at compile time so there is no runtime overhead. This feature makes C++ extremely flexible and reusable.",
    example: '#include<iostream>\nusing namespace std;\n\ntemplate<typename T>\nT maximum(T a, T b) {\n    return (a > b) ? a : b;\n}\n\ntemplate<typename T>\nclass Box {\nprivate:\n    T value;\npublic:\n    Box(T v) : value(v) {}\n    T getValue() { return value; }\n    void display() {\n        cout << "Box contains: " << value << endl;\n    }\n};\n\nint main() {\n    cout << "Max(5, 3): " << maximum(5, 3) << endl;\n    cout << "Max(3.14, 2.71): " << maximum(3.14, 2.71) << endl;\n    cout << "Max(\'z\', \'a\'): " << maximum(\'z\', \'a\') << endl;\n    \n    Box<int> intBox(42);\n    Box<string> strBox("Hello");\n    Box<double> dblBox(3.14);\n    \n    intBox.display();\n    strBox.display();\n    dblBox.display();\n    \n    return 0;\n}'
  },
  {
    id: 15,
    title: "Mini Project — Student Grade Calculator",
    content: "Congratulations! You have learned all the important concepts of C++. Now we will build a Student Grade Calculator that uses C++ features including OOP, STL, and file handling. The project has a Student class, stores students in a vector, calculates grades, and saves results. This is a real-world style C++ project. It uses classes, objects, constructors, vectors, file I/O, and sorting all together. After building this you can confidently say that you have built a complete project in C++. You will feel the speed and power of C++ through this project.",
    example: '#include<iostream>\n#include<vector>\n#include<string>\n#include<algorithm>\nusing namespace std;\n\nclass Student {\npublic:\n    string name;\n    double marks;\n    string grade;\n    \n    Student(string n, double m) : name(n), marks(m) {\n        if (m >= 90) grade = "A+";\n        else if (m >= 75) grade = "A";\n        else if (m >= 60) grade = "B";\n        else grade = "C";\n    }\n    \n    void display() {\n        cout << name << " | Marks: " << marks << " | Grade: " << grade << endl;\n    }\n};\n\nbool compareMarks(Student& a, Student& b) {\n    return a.marks > b.marks;\n}\n\nint main() {\n    vector<Student> students;\n    students.push_back(Student("Sharada", 92.5));\n    students.push_back(Student("Rahul", 87.0));\n    students.push_back(Student("Priya", 95.5));\n    students.push_back(Student("Amit", 65.0));\n    \n    sort(students.begin(), students.end(), compareMarks);\n    \n    cout << "=== Results (Rank wise) ===" << endl;\n    for (int i = 0; i < students.size(); i++) {\n        cout << "Rank " << i+1 << ": ";\n        students[i].display();\n    }\n    \n    double total = 0;\n    for (auto& s : students) total += s.marks;\n    cout << "\\nClass Average: " << total/students.size() << endl;\n    \n    return 0;\n}'
  },
]

const cppLessonsMarathi = [
  {
    id: 1,
    title: "C++ म्हणजे काय?",
    content: "C++ ही एक powerful, general-purpose programming language आहे जी 1979 साली Bjarne Stroustrup यांनी Bell Labs मध्ये बनवली. C++ ला C language चा extension मानले जाते. C++ चे नाव C मधील ++ operator वरून आले — ++ म्हणजे एक वाढवणे, म्हणजे C++ म्हणजे C पेक्षा चांगले. C++ ही compiled language आहे जी खूप fast चालते. म्हणूनच Unreal Engine सारखे game engines, operating systems, browsers, आणि high-performance software C++ मध्ये बनलेले आहेत. C++ object-oriented programming सोबत procedural programming देखील support करते. C++ मध्ये memory management manual असते ज्यामुळे programmer ला पूर्ण control मिळतो. हे industry मध्ये खूप demand मध्ये आहे खासकरून game development, embedded systems, आणि competitive programming मध्ये.",
    example: null
  },
  {
    id: 2,
    title: "C++ चा पहिला Program",
    content: "C++ मध्ये program लिहण्यासाठी आधी header files include करतो. iostream header file input आणि output साठी आवश्यक आहे. #include iostream लिहून iostream library program मध्ये आणतो. using namespace std; लिहिल्याने प्रत्येक वेळी std:: लिहण्याची गरज नाही. main() function ही अशी जागा आहे जिथून program execution सुरू होते. int main() म्हणून लिहतो कारण main function एक integer return करतो. cout ने output देतो — cout म्हणजे console output. << operator ने cout ला data देतो. endl ने नवीन ओळीवर जातो. return 0 ने program यशस्वीरित्या संपल्याचे signal मिळते. प्रत्येक statement च्या शेवटी semicolon आवश्यक आहे.",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    cout << "नमस्कार जग!" << endl;\n    cout << "माझा पहिला C++ program" << endl;\n    cout << 2024 << endl;\n    return 0;\n}'
  },
  {
    id: 3,
    title: "Variables आणि Data Types",
    content: "C++ मध्ये variables declare करताना data type लिहणे आवश्यक आहे. int ने पूर्ण संख्या store होते जसे 5, -10, 100. float ने दशांश संख्या store होते जसे 3.14. double ने float पेक्षा जास्त accurate दशांश संख्या store होते. char ने एक character store होतो जो single quotes मध्ये लिहतो. bool ने true किंवा false store होते. string ने text store होतो — यासाठी string header किंवा iostream आवश्यक आहे. long long ने खूप मोठ्या संख्या store होतात. unsigned int ने फक्त positive numbers store होतात. C++ मध्ये variable declare करून नंतर value assign करता येते किंवा declaration सोबत देखील. const keyword ने constant variable बनवतो ज्याची value बदलत नाही.",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nint main() {\n    int vay = 20;\n    float unchaai = 5.9f;\n    double pi = 3.14159;\n    char grade = \'A\';\n    bool isStudent = true;\n    string naam = "Sharada";\n    const int MAX = 100;\n    \n    cout << "नाव: " << naam << endl;\n    cout << "वय: " << vay << endl;\n    cout << "उंची: " << unchaai << endl;\n    cout << "Grade: " << grade << endl;\n    cout << "Student: " << isStudent << endl;\n    return 0;\n}'
  },
  {
    id: 4,
    title: "User कडून Input घेणे — cin",
    content: "C++ मध्ये user कडून input घेण्यासाठी cin वापरतो. cin म्हणजे console input. >> operator ने cin ला variable देतो. cin ने integer, float, double, char — सर्व types चा input घेता येतो. String input घेण्यासाठी getline() function वापरतो कारण cin >> string फक्त पहिला word घेतो. getline(cin, variable) ने पूर्ण line घेतो. Input घेण्यापूर्वी user ला message दाखवतो cout ने. Multiple values एकत्र देखील cin ने घेता येतात. cin.ignore() ने newline character ignore होतो — हे getline आधी वापरणे आवश्यक असते जेव्हा आधी cin >> वापरले असेल. C++ मध्ये input/output खूप fast असते जे competitive programming मध्ये फायदेशीर आहे.",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nint main() {\n    string naam;\n    int vay;\n    float marks;\n    \n    cout << "तुमचे नाव काय आहे? ";\n    getline(cin, naam);\n    \n    cout << "तुमचे वय किती आहे? ";\n    cin >> vay;\n    \n    cout << "तुमचे marks किती आहेत? ";\n    cin >> marks;\n    \n    cout << "नमस्कार " << naam << "!" << endl;\n    cout << "वय: " << vay << endl;\n    cout << "Marks: " << marks << endl;\n    \n    return 0;\n}'
  },
  {
    id: 5,
    title: "If/Else Conditions",
    content: "C++ मध्ये if/else ने decision making होते. Syntax Java सारखाच आहे — condition round brackets मध्ये आणि code block curly braces मध्ये. जर condition true असेल तर if block चालतो नाहीतर else block. else if ने multiple conditions check करता येतात. Comparison operators: == equal, != not equal, > greater than, < less than, >= greater than or equal, <= less than or equal. Logical operators: && AND, || OR, ! NOT. Ternary operator एक shorthand आहे — condition ? value_if_true : value_if_false. Switch statement ने multiple cases efficiently handle होतात. Switch मध्ये प्रत्येक case नंतर break लावणे आवश्यक आहे नाहीतर fall-through होतो म्हणजे सर्व cases चालत राहतात. Default case तेव्हा चालतो जेव्हा कोणताही case match होत नाही.",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    int vay = 18;\n    \n    if (vay >= 18) {\n        cout << "तुम्ही मतदान करू शकता" << endl;\n    } else {\n        cout << "तुम्ही मतदान करू शकत नाही" << endl;\n    }\n    \n    int marks = 85;\n    if (marks >= 90) {\n        cout << "Grade: A+" << endl;\n    } else if (marks >= 75) {\n        cout << "Grade: A" << endl;\n    } else if (marks >= 60) {\n        cout << "Grade: B" << endl;\n    } else {\n        cout << "Grade: C" << endl;\n    }\n    \n    string result = (marks >= 60) ? "Pass" : "Fail";\n    cout << "Result: " << result << endl;\n    \n    return 0;\n}'
  },
  {
    id: 6,
    title: "Loops — For, While, Do-While",
    content: "C++ मध्ये तीन प्रकारचे loops असतात. For loop तेव्हा वापरतो जेव्हा आपल्याला माहीत असते की loop किती वेळा चालेल. For loop मध्ये initialization, condition, आणि update तीन्ही parts असतात. While loop तेव्हा वापरतो जेव्हा iterations condition वर अवलंबून असतात. Do-while loop किमान एकदा नक्की चालतो. Range-based for loop C++11 पासून आला जो arrays आणि containers सहज iterate करतो. break statement ने loop लगेच बंद होतो. continue statement ने current iteration skip होते. Nested loops ने 2D patterns बनवतात. C++ मध्ये loops खूप fast असतात कारण directly machine code मध्ये compile होतात.",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        cout << "Count: " << i << endl;\n    }\n    \n    int count = 1;\n    while (count <= 3) {\n        cout << "While: " << count << endl;\n        count++;\n    }\n    \n    int n = 1;\n    do {\n        cout << "Do-While: " << n << endl;\n        n++;\n    } while (n <= 3);\n    \n    for (int i = 1; i <= 10; i++) {\n        cout << i << " चा square: " << i*i << endl;\n    }\n    \n    return 0;\n}'
  },
  {
    id: 7,
    title: "Functions",
    content: "C++ मध्ये functions reusable code blocks असतात. Function वापरण्यापूर्वी declare किंवा define करणे आवश्यक आहे. Function declaration मध्ये return type, name, आणि parameters असतात. void return type म्हणजे function काही return करत नाही. return keyword ने value परत मिळते. Function overloading मध्ये same नावाचे multiple functions different parameters सह असू शकतात. Default parameters मुळे function call करताना काही arguments skip करता येतात. Inline functions लहान functions साठी वापरतात जे fast execution देतात. Recursive functions स्वतःला call करतात जसे factorial काढणे. Pass by value मध्ये function ला copy मिळते. Pass by reference मध्ये actual variable मिळतो.",
    example: '#include<iostream>\nusing namespace std;\n\nvoid namaskaar(string naam);\nint add(int a, int b);\nint factorial(int n);\n\nint main() {\n    namaskaar("Sharada");\n    cout << "5 + 3 = " << add(5, 3) << endl;\n    cout << "5! = " << factorial(5) << endl;\n    return 0;\n}\n\nvoid namaskaar(string naam) {\n    cout << "नमस्कार " << naam << "!" << endl;\n}\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}'
  },
  {
    id: 8,
    title: "Arrays",
    content: "C++ मध्ये array म्हणजे एक fixed-size container जिथे same type च्या multiple values store होतात. Array declare करताना size specify करणे आवश्यक आहे. Index 0 पासून सुरू होतो. Array चा size नंतर बदलता येत नाही. sizeof() operator ने array चा size bytes मध्ये मिळतो. 2D array ने matrix बनवतात. Arrays functions ला pass करता येतात. C++ मध्ये array bounds check होत नाही म्हणजे चुकीचा index access केल्यावर undefined behavior होतो — हा एक common bug आहे. C style मध्ये string हे characters चे array असते. Modern C++ मध्ये array ऐवजी vector वापरणे चांगले आहे कारण vector चा size dynamic असतो. sort() algorithm ने array sort करता येतो.",
    example: '#include<iostream>\n#include<algorithm>\nusing namespace std;\n\nint main() {\n    int numbers[5] = {10, 20, 30, 40, 50};\n    \n    cout << "पहिला element: " << numbers[0] << endl;\n    \n    for (int i = 0; i < 5; i++) {\n        cout << numbers[i] << " ";\n    }\n    cout << endl;\n    \n    int scores[] = {85, 42, 91, 67, 78};\n    sort(scores, scores + 5);\n    \n    cout << "Sorted: ";\n    for (int i = 0; i < 5; i++) {\n        cout << scores[i] << " ";\n    }\n    cout << endl;\n    \n    return 0;\n}'
  },
  {
    id: 9,
    title: "Pointers — C++ ची Special Feature",
    content: "Pointer हे C++ चे सर्वात unique आणि powerful feature आहे जे त्याला इतर languages पेक्षा वेगळे बनवते. Pointer म्हणजे एक variable जो दुसऱ्या variable चा memory address store करतो. & operator ने variable चा address मिळतो. * operator ने pointer declare करतो आणि pointer ची value access करतो — याला dereferencing म्हणतात. Pointers ने directly memory access आणि manipulate करता येते. Dynamic memory allocation मध्ये pointers वापरतात — new ने memory allocate करतो आणि delete ने free करतो. Array चे नाव actually first element चा pointer असतो. Functions मध्ये pointers pass करून original value बदलता येते. Null pointer कुठेही point करत नाही. Dangling pointer तो pointer आहे ज्याची memory free झाली आहे.",
    example: '#include<iostream>\nusing namespace std;\n\nint main() {\n    int x = 42;\n    int* ptr = &x;\n    \n    cout << "x ची value: " << x << endl;\n    cout << "x चा address: " << &x << endl;\n    cout << "ptr मधील address: " << ptr << endl;\n    cout << "ptr ने value: " << *ptr << endl;\n    \n    *ptr = 100;\n    cout << "बदलल्यावर x: " << x << endl;\n    \n    int* dynArr = new int[3];\n    dynArr[0] = 10;\n    dynArr[1] = 20;\n    dynArr[2] = 30;\n    \n    for (int i = 0; i < 3; i++) {\n        cout << dynArr[i] << " ";\n    }\n    \n    delete[] dynArr;\n    return 0;\n}'
  },
  {
    id: 10,
    title: "Classes आणि Objects — OOP",
    content: "C++ मध्ये object-oriented programming साठी classes वापरतात. Class म्हणजे blueprint आणि object म्हणजे त्याचा instance. Class मध्ये data members म्हणजे variables आणि member functions म्हणजे methods असतात. Access specifiers तीन आहेत — public म्हणजे सर्वांसाठी accessible, private म्हणजे फक्त class च्या आत accessible, आणि protected म्हणजे child classes साठी accessible. Constructor चे नाव class च्या नावासारखे असते आणि object बनवताना automatically call होतो. Destructor चे नाव ~ सह class name असते आणि object destroy होताना call होतो — हे memory cleanup करते. this pointer current object ला refer करतो. Struct आणि class मधील फरक म्हणजे struct चे members default public असतात.",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nclass Student {\nprivate:\n    string naam;\n    int vay;\n    double marks;\n    \npublic:\n    Student(string n, int v, double m) {\n        naam = n;\n        vay = v;\n        marks = m;\n    }\n    \n    ~Student() {\n        cout << naam << " चा object delete झाला" << endl;\n    }\n    \n    void displayInfo() {\n        cout << "नाव: " << naam << endl;\n        cout << "वय: " << vay << endl;\n        cout << "Marks: " << marks << endl;\n    }\n    \n    double getMarks() { return marks; }\n};\n\nint main() {\n    Student s1("Sharada", 20, 92.5);\n    Student s2("Rahul", 22, 87.0);\n    \n    s1.displayInfo();\n    cout << "---" << endl;\n    s2.displayInfo();\n    \n    return 0;\n}'
  },
  {
    id: 11,
    title: "Inheritance आणि Polymorphism",
    content: "C++ मध्ये inheritance ने एक class दुसऱ्या class चे features inherit करू शकते. Syntax मध्ये class ChildClass : access_specifier ParentClass लिहतो. Public inheritance सर्वात common आहे. Child class parent चे public आणि protected members वापरू शकते. Method overriding मध्ये child class parent च्या method ला redefine करते. Polymorphism म्हणजे एकाच interface ने multiple behaviors. Virtual functions ने runtime polymorphism होते. virtual keyword ने function ला virtual बनवतो. override keyword C++11 पासून आला. Pure virtual functions = 0 ने define होतात आणि abstract class बनवतात. Abstract class चा object बनत नाही. Multiple inheritance C++ मध्ये शक्य आहे — एक class एकापेक्षा जास्त classes मधून inherit करू शकते.",
    example: '#include<iostream>\n#include<string>\nusing namespace std;\n\nclass Animal {\npublic:\n    string naam;\n    Animal(string n) : naam(n) {}\n    virtual void sound() {\n        cout << naam << " काहीतरी आवाज करतो" << endl;\n    }\n};\n\nclass Dog : public Animal {\npublic:\n    Dog(string n) : Animal(n) {}\n    void sound() override {\n        cout << naam << " भुंकतो: Woof!" << endl;\n    }\n    void fetch() {\n        cout << naam << " ball आणतो!" << endl;\n    }\n};\n\nclass Cat : public Animal {\npublic:\n    Cat(string n) : Animal(n) {}\n    void sound() override {\n        cout << naam << " म्याऊ करते: Meow!" << endl;\n    }\n};\n\nint main() {\n    Animal* a1 = new Dog("Tommy");\n    Animal* a2 = new Cat("Kitty");\n    a1->sound();\n    a2->sound();\n    delete a1;\n    delete a2;\n    return 0;\n}'
  },
  {
    id: 12,
    title: "STL — Vector आणि Map",
    content: "STL म्हणजे Standard Template Library हे C++ चे खूप powerful feature आहे. STL मध्ये ready-made data structures आणि algorithms असतात. Vector म्हणजे dynamic array जो automatically size वाढवतो. push_back() ने element add होतो. pop_back() ने last element remove होतो. size() ने size कळते. at() किंवा [] ने element access होतो. Map key-value pairs store करतो जिथे keys automatically sorted राहतात. Map मध्ये insert करण्यासाठी [] operator वापरतो. find() ने key search होते. Set unique values store करते. Queue आणि Stack देखील STL मध्ये आहेत. sort() algorithm ने vector sort होतो. STL वापरल्याने code छोटा आणि efficient होतो.",
    example: '#include<iostream>\n#include<vector>\n#include<map>\n#include<algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {5, 2, 8, 1, 9};\n    nums.push_back(4);\n    sort(nums.begin(), nums.end());\n    \n    cout << "Sorted vector: ";\n    for (int n : nums) {\n        cout << n << " ";\n    }\n    cout << endl;\n    \n    map<string, int> marks;\n    marks["Sharada"] = 92;\n    marks["Rahul"] = 87;\n    marks["Priya"] = 95;\n    \n    cout << "\\nMarks:" << endl;\n    for (auto& pair : marks) {\n        cout << pair.first << ": " << pair.second << endl;\n    }\n    \n    return 0;\n}'
  },
  {
    id: 13,
    title: "File Handling",
    content: "C++ मध्ये files read आणि write करण्यासाठी fstream library वापरतो. fstream header file include करावी लागते. ofstream ने file मध्ये write करतो — o म्हणजे output. ifstream ने file मधून read करतो — i म्हणजे input. fstream ने दोन्ही read आणि write करता येते. File open करण्यासाठी object बनवतो आणि file name देतो. is_open() ने check करतो की file successfully open झाली का. << operator ने file मध्ये write होते जसे cout मध्ये. >> किंवा getline() ने file मधून read होते. close() ने file बंद करतो — हे आवश्यक आहे. ios::app mode ने file च्या शेवटी data add होतो जुना data delete न करता. Binary mode मध्ये files binary format मध्ये read/write होतात.",
    example: '#include<iostream>\n#include<fstream>\n#include<string>\nusing namespace std;\n\nint main() {\n    ofstream outFile("students.txt");\n    \n    if (outFile.is_open()) {\n        outFile << "Sharada,92" << endl;\n        outFile << "Rahul,87" << endl;\n        outFile << "Priya,95" << endl;\n        outFile.close();\n        cout << "File यशस्वीरित्या लिहली!" << endl;\n    }\n    \n    ifstream inFile("students.txt");\n    string line;\n    \n    cout << "\\nFile चा content:" << endl;\n    if (inFile.is_open()) {\n        while (getline(inFile, line)) {\n            cout << line << endl;\n        }\n        inFile.close();\n    }\n    \n    return 0;\n}'
  },
  {
    id: 14,
    title: "Templates आणि Generic Programming",
    content: "Templates हे C++ चे एक advanced feature आहे जे generic programming enable करते. Templates ने असे functions आणि classes बनवता येतात जे कोणत्याही data type सोबत काम करतात. Function template मध्ये template typename T लिहतो जिथे T म्हणजे कोणत्याही type साठी placeholder. Function call होताना compiler आपोआप T ला actual type ने replace करतो. Class templates ने generic data structures बनवतात. STL चे vector, map सारखे सर्व containers templates आहेत. Template specialization ने specific type साठी वेगळी implementation देता येते. Variadic templates ने variable number of arguments handle होतात. Templates compile time वर resolve होतात म्हणून runtime overhead नाही. हे feature C++ ला खूप flexible आणि reusable बनवते.",
    example: '#include<iostream>\nusing namespace std;\n\ntemplate<typename T>\nT maximum(T a, T b) {\n    return (a > b) ? a : b;\n}\n\ntemplate<typename T>\nclass Box {\nprivate:\n    T value;\npublic:\n    Box(T v) : value(v) {}\n    T getValue() { return value; }\n    void display() {\n        cout << "Box मध्ये आहे: " << value << endl;\n    }\n};\n\nint main() {\n    cout << "Max(5, 3): " << maximum(5, 3) << endl;\n    cout << "Max(3.14, 2.71): " << maximum(3.14, 2.71) << endl;\n    cout << "Max(\'z\', \'a\'): " << maximum(\'z\', \'a\') << endl;\n    \n    Box<int> intBox(42);\n    Box<string> strBox("Hello");\n    Box<double> dblBox(3.14);\n    \n    intBox.display();\n    strBox.display();\n    dblBox.display();\n    \n    return 0;\n}'
  },
  {
    id: 15,
    title: "Mini Project — Student Grade Calculator",
    content: "शाब्बास! तुम्ही C++ चे सर्व महत्त्वाचे concepts शिकलात. आता आपण एक Student Grade Calculator बनवूया जो C++ च्या OOP, STL, आणि file handling features वापरेल. या project मध्ये Student class असेल, students ला vector मध्ये store करू, grades calculate करू, आणि results file मध्ये save करू. हे एक real-world C++ project आहे. यात classes, objects, constructors, vectors, file I/O, आणि sorting सर्व काही वापरले जाईल. हे project बनवल्यावर तुम्ही confidently म्हणू शकता की तुम्ही C++ मध्ये एक complete project बनवला आहे.",
    example: '#include<iostream>\n#include<vector>\n#include<string>\n#include<algorithm>\nusing namespace std;\n\nclass Student {\npublic:\n    string naam;\n    double marks;\n    string grade;\n    \n    Student(string n, double m) : naam(n), marks(m) {\n        if (m >= 90) grade = "A+";\n        else if (m >= 75) grade = "A";\n        else if (m >= 60) grade = "B";\n        else grade = "C";\n    }\n    \n    void display() {\n        cout << naam << " | Marks: " << marks << " | Grade: " << grade << endl;\n    }\n};\n\nbool compareMarks(Student& a, Student& b) {\n    return a.marks > b.marks;\n}\n\nint main() {\n    vector<Student> students;\n    students.push_back(Student("Sharada", 92.5));\n    students.push_back(Student("Rahul", 87.0));\n    students.push_back(Student("Priya", 95.5));\n    students.push_back(Student("Amit", 65.0));\n    \n    sort(students.begin(), students.end(), compareMarks);\n    \n    cout << "=== Results (Rank wise) ===" << endl;\n    for (int i = 0; i < students.size(); i++) {\n        cout << "Rank " << i+1 << ": ";\n        students[i].display();\n    }\n    \n    double total = 0;\n    for (auto& s : students) total += s.marks;\n    cout << "\\nClass Average: " << total/students.size() << endl;\n    \n    return 0;\n}'
  },
]

// ─────────────────────────────────────────
// HTML LESSONS — HINDI (paste after cppLessonsMarathi)
// ─────────────────────────────────────────
const htmlLessons = [
  {
    id: 1,
    title: "HTML क्या है?",
    content: "HTML का पूरा नाम है HyperText Markup Language। HTML हर website का सबसे बुनियादी हिस्सा है — यह web page की structure और content बनाता है। जैसे एक घर बनाने के लिए ईंटें चाहिए, वैसे ही website बनाने के लिए HTML चाहिए। HTML elements से बनता है जिन्हें tags कहते हैं। Tags angle brackets में लिखे जाते हैं जैसे <p> या <h1>। ज्यादातर tags के दो हिस्से होते हैं — opening tag और closing tag, और बीच में content होता है। HTML किसी programming language की तरह logic नहीं चलाता, यह सिर्फ structure define करता है। हर browser HTML को पढ़कर उसे visual page में बदल देता है। HTML को CSS के साथ design मिलती है और JavaScript के साथ interactivity।",
    example: null
  },
  {
    id: 2,
    title: "HTML का Basic Structure",
    content: "हर HTML document की एक fixed structure होती है। सबसे ऊपर <!DOCTYPE html> लिखते हैं जो browser को बताता है कि यह HTML5 document है। पूरा content <html> tag के अंदर होता है। <head> section में page की जानकारी होती है जो screen पर नहीं दिखती जैसे title, meta tags, और CSS links। <title> tag से browser tab में नाम दिखता है। <body> section में वो सब कुछ होता है जो user को दिखता है — text, images, buttons, सब कुछ। यह structure हर HTML page में same रहती है, सिर्फ body के अंदर का content बदलता है। Indentation से code पढ़ना आसान होता है हालांकि browser इसे ignore करता है।",
    example: '<!DOCTYPE html>\n<html>\n<head>\n    <title>मेरी पहली Website</title>\n</head>\n<body>\n    <h1>नमस्ते दुनिया!</h1>\n    <p>यह मेरा पहला HTML page है।</p>\n</body>\n</html>'
  },
  {
    id: 3,
    title: "Headings और Paragraphs",
    content: "HTML में headings बनाने के लिए h1 से h6 tags use होते हैं। h1 सबसे बड़ा और सबसे important heading होता है, h6 सबसे छोटा। एक page में आमतौर पर सिर्फ एक h1 होना चाहिए क्योंकि यह main title के लिए होता है। Headings page की structure और SEO दोनों के लिए जरूरी हैं — search engines headings देखकर content समझते हैं। Paragraph बनाने के लिए <p> tag use होता है। हर <p> tag एक नया block बनाता है जिसके पहले और बाद में थोड़ी space अपने आप आ जाती है। <br> tag से line break होता है बिना नया paragraph बनाए। <hr> tag से horizontal line आती है जो content को अलग करती है।",
    example: '<h1>मुख्य Heading</h1>\n<h2>Section Heading</h2>\n<h3>Sub-section Heading</h3>\n\n<p>यह एक paragraph है जिसमें आम तौर पर कुछ vाक्य होते हैं।</p>\n<p>यह दूसरा paragraph है।</p>\n\n<p>पहली line<br>दूसरी line (br से)</p>\n\n<hr>\n<p>Horizontal line के बाद का content</p>'
  },
  {
    id: 4,
    title: "Links और Images",
    content: "HTML में links बनाने के लिए <a> tag use होता है जिसका मतलब है anchor। href attribute में वो URL या path डालते हैं जहाँ link जाएगा। Link के text को opening और closing <a> tags के बीच लिखते हैं। target='_blank' से link नए tab में खुलता है। Images के लिए <img> tag use होता है जो self-closing होता है यानी इसका कोई closing tag नहीं होता। src attribute में image का path या URL होता है। alt attribute बहुत जरूरी है — यह image के बारे में text बताता है जो तब दिखता है जब image load न हो, और screen readers के लिए भी जरूरी है accessibility के लिए। width और height attributes से image का size control कर सकते हैं।",
    example: '<a href="https://www.google.com">Google पर जाएं</a>\n\n<a href="https://www.google.com" target="_blank">नए tab में Google खोलें</a>\n\n<img src="logo.png" alt="कंपनी का logo" width="200" height="100">\n\n<a href="about.html">About page पर जाएं</a>'
  },
  {
    id: 5,
    title: "Lists — Ordered और Unordered",
    content: "HTML में दो प्रकार की lists होती हैं। Unordered list यानी bullet points वाली list <ul> tag से बनती है। हर item <li> tag में लिखते हैं जिसका मतलब है list item। Ordered list यानी numbered list <ol> tag से बनती है, इसके items भी <li> में होते हैं लेकिन browser automatically numbers लगा देता है। List के अंदर list भी हो सकती है जिसे nested list कहते हैं — यह sub-categories दिखाने के लिए useful है। Description list <dl> tag से बनती है जिसमें <dt> term होता है और <dd> उसका description। Lists menus, instructions, और structured content दिखाने के लिए बहुत use होती हैं।",
    example: '<h3>मेरी पसंदीदा Fruits (Unordered)</h3>\n<ul>\n    <li>Apple</li>\n    <li>Banana</li>\n    <li>Mango</li>\n</ul>\n\n<h3>Steps (Ordered)</h3>\n<ol>\n    <li>Water उबालें</li>\n    <li>Tea पत्ती डालें</li>\n    <li>5 मिनट उबालें</li>\n    <li>Cup में डालें</li>\n</ol>\n\n<h3>Nested List</h3>\n<ul>\n    <li>Fruits\n        <ul>\n            <li>Apple</li>\n            <li>Banana</li>\n        </ul>\n    </li>\n    <li>Vegetables</li>\n</ul>'
  },
  {
    id: 6,
    title: "Tables",
    content: "HTML में tables से data को rows और columns में organize करते हैं। <table> tag से table शुरू होती है। <tr> tag table row के लिए होता है। <th> tag table header यानी column के title के लिए होता है जो bold और center में दिखता है। <td> tag table data के लिए होता है यानी actual cells का content। पूरी table में जितनी <tr> होंगी उतनी rows बनेंगी। हर row में जितने <td> या <th> होंगे उतने columns बनेंगे। colspan attribute से एक cell कई columns में फैल सकता है। rowspan attribute से एक cell कई rows में फैल सकता है। Tables tabular data दिखाने के लिए perfect हैं जैसे price lists, schedules, या comparison charts।",
    example: '<table border="1">\n    <tr>\n        <th>नाम</th>\n        <th>उम्र</th>\n        <th>शहर</th>\n    </tr>\n    <tr>\n        <td>Sharada</td>\n        <td>20</td>\n        <td>Mumbai</td>\n    </tr>\n    <tr>\n        <td>Rahul</td>\n        <td>22</td>\n        <td>Delhi</td>\n    </tr>\n</table>'
  },
  {
    id: 7,
    title: "Forms",
    content: "HTML में forms से user से data collect करते हैं जैसे login, registration, या contact forms। <form> tag से form शुरू होता है। action attribute बताता है कि data कहाँ submit होगा। method attribute बताता है कैसे data भेजा जाएगा — GET या POST। <input> tag सबसे common form element है और self-closing होता है। type attribute बताता है input किस प्रकार का है — text, email, password, number, checkbox, radio, या submit। <label> tag input को describe करता है और accessibility के लिए जरूरी है। placeholder attribute से hint text दिखता है। <textarea> multi-line text के लिए होता है। <select> और <option> से dropdown menu बनता है। <button> या submit type का input form submit करता है।",
    example: '<form action="/submit" method="post">\n    <label for="naam">नाम:</label>\n    <input type="text" id="naam" name="naam" placeholder="अपना नाम लिखें">\n    <br><br>\n    \n    <label for="email">Email:</label>\n    <input type="email" id="email" name="email">\n    <br><br>\n    \n    <label for="message">Message:</label><br>\n    <textarea id="message" name="message" rows="4"></textarea>\n    <br><br>\n    \n    <button type="submit">Submit करें</button>\n</form>'
  },
  {
    id: 8,
    title: "Semantic HTML Tags",
    content: "Semantic HTML tags ऐसे tags हैं जिनका नाम ही बताता है कि उनके अंदर किस प्रकार का content है। <header> page या section के top part के लिए होता है, अक्सर logo और navigation के लिए। <nav> navigation links के लिए होता है। <main> page के main content area के लिए होता है। <section> content के अलग-अलग sections के लिए होता है। <article> independent content के लिए होता है जैसे blog post। <aside> side content के लिए होता है जैसे sidebar। <footer> page के bottom part के लिए होता है जिसमें copyright, links होते हैं। Semantic tags use करने से SEO बेहतर होता है, accessibility बढ़ती है, और code पढ़ना आसान होता है क्योंकि div की जगह meaningful names use होते हैं।",
    example: '<header>\n    <h1>मेरी Website</h1>\n    <nav>\n        <a href="#home">Home</a>\n        <a href="#about">About</a>\n    </nav>\n</header>\n\n<main>\n    <article>\n        <h2>मेरा पहला Blog Post</h2>\n        <p>यह article का content है...</p>\n    </article>\n    \n    <aside>\n        <p>Related links यहाँ होते हैं</p>\n    </aside>\n</main>\n\n<footer>\n    <p>&copy; 2024 मेरी Website</p>\n</footer>'
  },
  {
    id: 9,
    title: "Div और Span — Container Elements",
    content: "<div> और <span> generic container elements हैं जो content को group करने के लिए use होते हैं। <div> एक block-level element है यानी यह अपनी एक नई line लेता है और पूरी width occupy करता है। <div> से बड़े sections बनाते हैं जैसे header, sidebar, या content area। <span> एक inline element है यानी यह text के बीच में बिना नई line लिए fit हो जाता है। <span> से किसी text के छोटे हिस्से को style करते हैं जैसे एक word को highlight करना। ये दोनों खुद कोई meaning नहीं रखते, सिर्फ CSS और JavaScript के लिए hooks होते हैं। id attribute से unique element को target करते हैं। class attribute से multiple elements को group करके एक साथ style करते हैं।",
    example: '<div id="container">\n    <div class="header-box">\n        <h2>यह एक div section है</h2>\n        <p>इस paragraph में <span style="color: red;">यह word</span> highlight है।</p>\n    </div>\n    \n    <div class="content-box">\n        <p>दूसरा content area</p>\n    </div>\n</div>'
  },
  {
    id: 10,
    title: "HTML Attributes — Mini Project",
    content: "शाबाश! आपने HTML के सभी basic concepts सीख लिए। Attributes हर HTML tag को extra information देते हैं। हर attribute का एक name और value होता है जैसे src='image.png' में src attribute है और image.png value है। Global attributes हर tag पर use हो सकते हैं — id से unique identify करते हैं, class से group बनाते हैं, style से inline CSS देते हैं, title से tooltip text देते हैं। अब हम एक mini profile page बनाएंगे जो headings, paragraphs, image, list, और link सब को मिलाकर एक complete structure बनाएगा। यह project आपको दिखाएगा कि real websites कैसे बनती हैं — सब HTML elements मिलकर एक meaningful page बनाते हैं।",
    example: '<!DOCTYPE html>\n<html>\n<head>\n    <title>मेरी Profile</title>\n</head>\n<body>\n    <header>\n        <h1>Sharada का Profile</h1>\n    </header>\n    \n    <main>\n        <img src="profile.jpg" alt="Profile picture" width="150">\n        <p>नमस्ते! मेरा नाम Sharada है और मैं एक student हूँ।</p>\n        \n        <h2>मेरी Skills</h2>\n        <ul>\n            <li>HTML</li>\n            <li>CSS</li>\n            <li>Problem Solving</li>\n        </ul>\n        \n        <h2>मुझसे संपर्क करें</h2>\n        <a href="mailto:sharada@example.com">Email भेजें</a>\n    </main>\n    \n    <footer>\n        <p>&copy; 2024 Sharada का Portfolio</p>\n    </footer>\n</body>\n</html>'
  },
]

// ─────────────────────────────────────────
// HTML LESSONS — ENGLISH
// ─────────────────────────────────────────
const htmlLessonsEnglish = [
  {
    id: 1,
    title: "What is HTML?",
    content: "HTML stands for HyperText Markup Language. HTML is the most basic building block of every website — it creates the structure and content of a web page. Just like you need bricks to build a house, you need HTML to build a website. HTML is made up of elements called tags. Tags are written inside angle brackets like p or h1. Most tags have two parts, an opening tag and a closing tag, with content in between. HTML does not run logic like a programming language, it only defines structure. Every browser reads HTML and turns it into a visual page. HTML gets its design from CSS and its interactivity from JavaScript.",
    example: null
  },
  {
    id: 2,
    title: "Basic Structure of HTML",
    content: "Every HTML document has a fixed structure. At the very top we write DOCTYPE html which tells the browser this is an HTML5 document. All the content lives inside the html tag. The head section contains information about the page that is not visible on screen, such as the title, meta tags, and CSS links. The title tag controls the name shown in the browser tab. The body section contains everything the user actually sees — text, images, buttons, everything. This structure stays the same across every HTML page, only the content inside the body changes. Indentation makes code easier to read although the browser itself ignores it.",
    example: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Website</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <p>This is my first HTML page.</p>\n</body>\n</html>'
  },
  {
    id: 3,
    title: "Headings and Paragraphs",
    content: "HTML uses h1 through h6 tags to create headings. h1 is the largest and most important heading and h6 is the smallest. A page usually should have only one h1 because it is meant for the main title. Headings matter both for page structure and for SEO since search engines read headings to understand content. The p tag is used to create a paragraph. Every p tag creates a new block with a small space automatically added before and after it. The br tag creates a line break without starting a new paragraph. The hr tag inserts a horizontal line that visually separates content.",
    example: '<h1>Main Heading</h1>\n<h2>Section Heading</h2>\n<h3>Sub-section Heading</h3>\n\n<p>This is a paragraph that usually contains a few sentences.</p>\n<p>This is a second paragraph.</p>\n\n<p>First line<br>Second line (using br)</p>\n\n<hr>\n<p>Content after the horizontal line</p>'
  },
  {
    id: 4,
    title: "Links and Images",
    content: "The a tag, which stands for anchor, is used to create links in HTML. The href attribute holds the URL or path that the link points to. The text of the link goes between the opening and closing a tags. Adding target equals underscore blank opens the link in a new tab. The img tag is used for images and is self-closing meaning it has no closing tag. The src attribute holds the path or URL of the image. The alt attribute is very important — it provides text describing the image which shows if the image fails to load, and it is essential for screen readers and accessibility. The width and height attributes let you control the size of the image.",
    example: '<a href="https://www.google.com">Go to Google</a>\n\n<a href="https://www.google.com" target="_blank">Open Google in new tab</a>\n\n<img src="logo.png" alt="Company logo" width="200" height="100">\n\n<a href="about.html">Go to About page</a>'
  },
  {
    id: 5,
    title: "Lists — Ordered and Unordered",
    content: "HTML has two main types of lists. An unordered list, which shows bullet points, is created using the ul tag. Each item is written inside an li tag which stands for list item. An ordered list, which shows numbers, is created using the ol tag, and its items are also written inside li tags, but the browser automatically adds numbers. A list can contain another list inside it which is called a nested list, useful for showing sub-categories. A description list is created with the dl tag where dt is the term and dd is its description. Lists are heavily used for menus, instructions, and any structured content.",
    example: '<h3>My Favorite Fruits (Unordered)</h3>\n<ul>\n    <li>Apple</li>\n    <li>Banana</li>\n    <li>Mango</li>\n</ul>\n\n<h3>Steps (Ordered)</h3>\n<ol>\n    <li>Boil water</li>\n    <li>Add tea leaves</li>\n    <li>Boil for 5 minutes</li>\n    <li>Pour into a cup</li>\n</ol>\n\n<h3>Nested List</h3>\n<ul>\n    <li>Fruits\n        <ul>\n            <li>Apple</li>\n            <li>Banana</li>\n        </ul>\n    </li>\n    <li>Vegetables</li>\n</ul>'
  },
  {
    id: 6,
    title: "Tables",
    content: "HTML tables organize data into rows and columns. The table tag starts the table. The tr tag represents a table row. The th tag represents a table header, used for column titles, and is displayed bold and centered by default. The td tag represents table data, the actual cell content. The number of tr tags determines how many rows the table has. The number of td or th tags in each row determines how many columns there are. The colspan attribute lets a cell span across multiple columns. The rowspan attribute lets a cell span across multiple rows. Tables are perfect for showing tabular data such as price lists, schedules, or comparison charts.",
    example: '<table border="1">\n    <tr>\n        <th>Name</th>\n        <th>Age</th>\n        <th>City</th>\n    </tr>\n    <tr>\n        <td>Sharada</td>\n        <td>20</td>\n        <td>Mumbai</td>\n    </tr>\n    <tr>\n        <td>Rahul</td>\n        <td>22</td>\n        <td>Delhi</td>\n    </tr>\n</table>'
  },
  {
    id: 7,
    title: "Forms",
    content: "HTML forms are used to collect data from a user, for example in login, registration, or contact forms. The form tag starts a form. The action attribute specifies where the data will be submitted. The method attribute specifies how the data is sent — GET or POST. The input tag is the most common form element and is self-closing. The type attribute determines what kind of input it is — text, email, password, number, checkbox, radio, or submit. The label tag describes an input and is important for accessibility. The placeholder attribute shows hint text inside an input. The textarea tag is used for multi-line text. The select and option tags together create a dropdown menu. A button or an input with type submit submits the form.",
    example: '<form action="/submit" method="post">\n    <label for="name">Name:</label>\n    <input type="text" id="name" name="name" placeholder="Enter your name">\n    <br><br>\n    \n    <label for="email">Email:</label>\n    <input type="email" id="email" name="email">\n    <br><br>\n    \n    <label for="message">Message:</label><br>\n    <textarea id="message" name="message" rows="4"></textarea>\n    <br><br>\n    \n    <button type="submit">Submit</button>\n</form>'
  },
  {
    id: 8,
    title: "Semantic HTML Tags",
    content: "Semantic HTML tags are tags whose name itself describes what kind of content they hold. The header tag is for the top section of a page or area, often used for logos and navigation. The nav tag is for navigation links. The main tag represents the main content area of a page. The section tag is used for distinct sections of content. The article tag is for independent content such as a blog post. The aside tag is for side content such as a sidebar. The footer tag is for the bottom section containing copyright and links. Using semantic tags improves SEO, increases accessibility, and makes code easier to read since meaningful names replace generic divs.",
    example: '<header>\n    <h1>My Website</h1>\n    <nav>\n        <a href="#home">Home</a>\n        <a href="#about">About</a>\n    </nav>\n</header>\n\n<main>\n    <article>\n        <h2>My First Blog Post</h2>\n        <p>This is the article content...</p>\n    </article>\n    \n    <aside>\n        <p>Related links go here</p>\n    </aside>\n</main>\n\n<footer>\n    <p>&copy; 2024 My Website</p>\n</footer>'
  },
  {
    id: 9,
    title: "Div and Span — Container Elements",
    content: "Div and span are generic container elements used to group content. Div is a block-level element which means it takes its own new line and occupies the full available width. Div is used to create larger sections such as headers, sidebars, or content areas. Span is an inline element which means it sits within text without starting a new line. Span is used to style a small piece of text, such as highlighting a single word. Neither of these have any meaning of their own, they only serve as hooks for CSS and JavaScript. The id attribute targets a unique element. The class attribute groups multiple elements so they can be styled together.",
    example: '<div id="container">\n    <div class="header-box">\n        <h2>This is a div section</h2>\n        <p>In this paragraph, <span style="color: red;">this word</span> is highlighted.</p>\n    </div>\n    \n    <div class="content-box">\n        <p>Another content area</p>\n    </div>\n</div>'
  },
  {
    id: 10,
    title: "HTML Attributes — Mini Project",
    content: "Congratulations! You have learned all the basic concepts of HTML. Attributes give every HTML tag extra information. Every attribute has a name and a value, such as src equals image.png, where src is the attribute and image.png is its value. Global attributes can be used on any tag — id uniquely identifies an element, class groups elements, style provides inline CSS, and title shows tooltip text. Now we will build a mini profile page that combines headings, paragraphs, an image, a list, and a link into one complete structure. This project shows you how real websites are built — all HTML elements working together to form one meaningful page.",
    example: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Profile</title>\n</head>\n<body>\n    <header>\n        <h1>Sharada\'s Profile</h1>\n    </header>\n    \n    <main>\n        <img src="profile.jpg" alt="Profile picture" width="150">\n        <p>Hello! My name is Sharada and I am a student.</p>\n        \n        <h2>My Skills</h2>\n        <ul>\n            <li>HTML</li>\n            <li>CSS</li>\n            <li>Problem Solving</li>\n        </ul>\n        \n        <h2>Contact Me</h2>\n        <a href="mailto:sharada@example.com">Send Email</a>\n    </main>\n    \n    <footer>\n        <p>&copy; 2024 Sharada\'s Portfolio</p>\n    </footer>\n</body>\n</html>'
  },
]

// ─────────────────────────────────────────
// HTML LESSONS — MARATHI
// ─────────────────────────────────────────
const htmlLessonsMarathi = [
  {
    id: 1,
    title: "HTML म्हणजे काय?",
    content: "HTML चे पूर्ण नाव आहे HyperText Markup Language. HTML हा प्रत्येक website चा सर्वात मूलभूत भाग आहे — हा web page ची structure आणि content बनवतो. जसे घर बांधण्यासाठी विटा लागतात, तसेच website बनवण्यासाठी HTML लागते. HTML elements ने बनते ज्यांना tags म्हणतात. Tags angle brackets मध्ये लिहतात जसे p किंवा h1. बहुतेक tags चे दोन भाग असतात — opening tag आणि closing tag, आणि मध्ये content असते. HTML कोणत्याही programming language सारखे logic चालवत नाही, हे फक्त structure define करते. प्रत्येक browser HTML वाचून त्याला visual page मध्ये बदलतो. HTML ला CSS सोबत design मिळते आणि JavaScript सोबत interactivity.",
    example: null
  },
  {
    id: 2,
    title: "HTML ची Basic Structure",
    content: "प्रत्येक HTML document ची एक fixed structure असते. सर्वात वर DOCTYPE html लिहतो जो browser ला सांगतो की हे HTML5 document आहे. संपूर्ण content html tag च्या आत असते. head section मध्ये page ची माहिती असते जी screen वर दिसत नाही जसे title, meta tags, आणि CSS links. title tag ने browser tab मध्ये नाव दिसते. body section मध्ये ते सर्व काही असते जे user ला दिसते — text, images, buttons, सर्व काही. ही structure प्रत्येक HTML page मध्ये same राहते, फक्त body च्या आतला content बदलतो. Indentation मुळे code वाचणे सोपे होते जरी browser ते ignore करतो.",
    example: '<!DOCTYPE html>\n<html>\n<head>\n    <title>माझी पहिली Website</title>\n</head>\n<body>\n    <h1>नमस्कार जग!</h1>\n    <p>हे माझे पहिले HTML page आहे।</p>\n</body>\n</html>'
  },
  {
    id: 3,
    title: "Headings आणि Paragraphs",
    content: "HTML मध्ये headings बनवण्यासाठी h1 ते h6 tags वापरतात. h1 सर्वात मोठी आणि सर्वात important heading असते, h6 सर्वात लहान. एका page मध्ये साधारणपणे फक्त एक h1 असायला हवी कारण ही main title साठी असते. Headings page च्या structure आणि SEO दोन्हीसाठी आवश्यक आहेत — search engines headings बघून content समजतात. Paragraph बनवण्यासाठी p tag वापरतात. प्रत्येक p tag एक नवीन block बनवतो ज्याच्या आधी आणि नंतर थोडी space आपोआप येते. br tag ने line break होतो नवीन paragraph न बनवता. hr tag ने horizontal line येते जी content वेगळे करते.",
    example: '<h1>मुख्य Heading</h1>\n<h2>Section Heading</h2>\n<h3>Sub-section Heading</h3>\n\n<p>हा एक paragraph आहे ज्यात सामान्यतः काही वाक्ये असतात.</p>\n<p>हा दुसरा paragraph आहे.</p>\n\n<p>पहिली ओळ<br>दुसरी ओळ (br ने)</p>\n\n<hr>\n<p>Horizontal line नंतरचा content</p>'
  },
  {
    id: 4,
    title: "Links आणि Images",
    content: "HTML मध्ये links बनवण्यासाठी a tag वापरतात ज्याचा अर्थ आहे anchor. href attribute मध्ये तो URL किंवा path टाकतो जिथे link जाईल. Link चा text opening आणि closing a tags च्या मध्ये लिहतो. target='_blank' ने link नवीन tab मध्ये उघडतो. Images साठी img tag वापरतात जो self-closing असतो म्हणजे याला closing tag नसतो. src attribute मध्ये image चा path किंवा URL असतो. alt attribute खूप महत्त्वाचा आहे — हा image बद्दल text सांगतो जो image load न झाल्यास दिसतो, आणि screen readers साठी देखील आवश्यक आहे accessibility साठी. width आणि height attributes ने image चा size control करता येतो.",
    example: '<a href="https://www.google.com">Google वर जा</a>\n\n<a href="https://www.google.com" target="_blank">नवीन tab मध्ये Google उघडा</a>\n\n<img src="logo.png" alt="कंपनीचा logo" width="200" height="100">\n\n<a href="about.html">About page वर जा</a>'
  },
  {
    id: 5,
    title: "Lists — Ordered आणि Unordered",
    content: "HTML मध्ये दोन प्रकारच्या lists असतात. Unordered list म्हणजे bullet points असलेली list ul tag ने बनते. प्रत्येक item li tag मध्ये लिहतो ज्याचा अर्थ आहे list item. Ordered list म्हणजे numbered list ol tag ने बनते, यातील items देखील li मध्ये असतात पण browser आपोआप numbers लावतो. List च्या आत list देखील असू शकते ज्याला nested list म्हणतात — हे sub-categories दाखवण्यासाठी उपयुक्त आहे. Description list dl tag ने बनते ज्यात dt term असतो आणि dd त्याचे description. Lists menus, instructions, आणि structured content दाखवण्यासाठी खूप वापरल्या जातात.",
    example: '<h3>माझी आवडती Fruits (Unordered)</h3>\n<ul>\n    <li>Apple</li>\n    <li>Banana</li>\n    <li>Mango</li>\n</ul>\n\n<h3>Steps (Ordered)</h3>\n<ol>\n    <li>पाणी उकळा</li>\n    <li>Tea पाने टाका</li>\n    <li>5 मिनिटे उकळा</li>\n    <li>Cup मध्ये ओता</li>\n</ol>\n\n<h3>Nested List</h3>\n<ul>\n    <li>Fruits\n        <ul>\n            <li>Apple</li>\n            <li>Banana</li>\n        </ul>\n    </li>\n    <li>Vegetables</li>\n</ul>'
  },
  {
    id: 6,
    title: "Tables",
    content: "HTML मध्ये tables ने data ला rows आणि columns मध्ये organize करतो. table tag ने table सुरू होते. tr tag table row साठी असतो. th tag table header साठी असतो म्हणजे column च्या title साठी जो bold आणि center मध्ये दिसतो. td tag table data साठी असतो म्हणजे actual cells चा content. संपूर्ण table मध्ये जितक्या tr असतील तितक्या rows बनतील. प्रत्येक row मध्ये जितके td किंवा th असतील तितके columns बनतील. colspan attribute ने एक cell अनेक columns मध्ये पसरू शकतो. rowspan attribute ने एक cell अनेक rows मध्ये पसरू शकतो. Tables tabular data दाखवण्यासाठी perfect आहेत जसे price lists, schedules, किंवा comparison charts.",
    example: '<table border="1">\n    <tr>\n        <th>नाव</th>\n        <th>वय</th>\n        <th>शहर</th>\n    </tr>\n    <tr>\n        <td>Sharada</td>\n        <td>20</td>\n        <td>Mumbai</td>\n    </tr>\n    <tr>\n        <td>Rahul</td>\n        <td>22</td>\n        <td>Delhi</td>\n    </tr>\n</table>'
  },
  {
    id: 7,
    title: "Forms",
    content: "HTML मध्ये forms ने user कडून data collect करतो जसे login, registration, किंवा contact forms. form tag ने form सुरू होतो. action attribute सांगतो की data कुठे submit होईल. method attribute सांगतो data कसे पाठवले जाईल — GET किंवा POST. input tag सर्वात common form element आहे आणि self-closing असतो. type attribute सांगतो input कोणत्या प्रकारचा आहे — text, email, password, number, checkbox, radio, किंवा submit. label tag input ला describe करतो आणि accessibility साठी आवश्यक आहे. placeholder attribute ने hint text दिसतो. textarea multi-line text साठी असतो. select आणि option ने dropdown menu बनतो. button किंवा submit type चा input form submit करतो.",
    example: '<form action="/submit" method="post">\n    <label for="naam">नाव:</label>\n    <input type="text" id="naam" name="naam" placeholder="तुमचे नाव लिहा">\n    <br><br>\n    \n    <label for="email">Email:</label>\n    <input type="email" id="email" name="email">\n    <br><br>\n    \n    <label for="message">Message:</label><br>\n    <textarea id="message" name="message" rows="4"></textarea>\n    <br><br>\n    \n    <button type="submit">Submit करा</button>\n</form>'
  },
  {
    id: 8,
    title: "Semantic HTML Tags",
    content: "Semantic HTML tags असे tags आहेत ज्यांच्या नावावरूनच कळते की त्यांच्यात कोणत्या प्रकारचा content आहे. header tag page किंवा section च्या top भागासाठी असतो, बऱ्याचदा logo आणि navigation साठी. nav tag navigation links साठी असतो. main tag page च्या main content area साठी असतो. section tag content च्या वेगवेगळ्या sections साठी असतो. article tag independent content साठी असतो जसे blog post. aside tag side content साठी असतो जसे sidebar. footer tag page च्या bottom भागासाठी असतो ज्यात copyright, links असतात. Semantic tags वापरल्याने SEO चांगला होतो, accessibility वाढते, आणि code वाचणे सोपे होते कारण div ऐवजी meaningful names वापरले जातात.",
    example: '<header>\n    <h1>माझी Website</h1>\n    <nav>\n        <a href="#home">Home</a>\n        <a href="#about">About</a>\n    </nav>\n</header>\n\n<main>\n    <article>\n        <h2>माझी पहिली Blog Post</h2>\n        <p>हा article चा content आहे...</p>\n    </article>\n    \n    <aside>\n        <p>Related links इथे असतात</p>\n    </aside>\n</main>\n\n<footer>\n    <p>&copy; 2024 माझी Website</p>\n</footer>'
  },
  {
    id: 9,
    title: "Div आणि Span — Container Elements",
    content: "div आणि span हे generic container elements आहेत जे content group करण्यासाठी वापरतात. div हा block-level element आहे म्हणजे हा स्वतःची नवीन ओळ घेतो आणि पूर्ण width occupy करतो. div ने मोठे sections बनवतात जसे header, sidebar, किंवा content area. span हा inline element आहे म्हणजे हा text च्या मध्ये नवीन ओळ न घेता fit होतो. span ने एखाद्या text च्या लहान भागाला style करतो जसे एका word ला highlight करणे. हे दोन्ही स्वतः कोणताही meaning ठेवत नाहीत, फक्त CSS आणि JavaScript साठी hooks असतात. id attribute ने unique element ला target करतो. class attribute ने multiple elements ला group करून एकत्र style करतो.",
    example: '<div id="container">\n    <div class="header-box">\n        <h2>हे एक div section आहे</h2>\n        <p>या paragraph मध्ये <span style="color: red;">हा word</span> highlight आहे.</p>\n    </div>\n    \n    <div class="content-box">\n        <p>दुसरा content area</p>\n    </div>\n</div>'
  },
  {
    id: 10,
    title: "HTML Attributes — Mini Project",
    content: "शाब्बास! तुम्ही HTML चे सर्व basic concepts शिकलात. Attributes प्रत्येक HTML tag ला extra information देतात. प्रत्येक attribute चे एक name आणि value असते जसे src='image.png' मध्ये src attribute आहे आणि image.png value आहे. Global attributes कोणत्याही tag वर वापरता येतात — id ने unique identify करतो, class ने group बनवतो, style ने inline CSS देतो, title ने tooltip text देतो. आता आपण एक mini profile page बनवूया जो headings, paragraphs, image, list, आणि link सर्व एकत्र करून एक complete structure बनवेल. हे project तुम्हाला दाखवेल की real websites कशा बनतात — सर्व HTML elements मिळून एक meaningful page बनवतात.",
    example: '<!DOCTYPE html>\n<html>\n<head>\n    <title>माझी Profile</title>\n</head>\n<body>\n    <header>\n        <h1>Sharada चे Profile</h1>\n    </header>\n    \n    <main>\n        <img src="profile.jpg" alt="Profile picture" width="150">\n        <p>नमस्कार! माझे नाव Sharada आहे आणि मी एक student आहे.</p>\n        \n        <h2>माझे Skills</h2>\n        <ul>\n            <li>HTML</li>\n            <li>CSS</li>\n            <li>Problem Solving</li>\n        </ul>\n        \n        <h2>माझ्याशी संपर्क साधा</h2>\n        <a href="mailto:sharada@example.com">Email पाठवा</a>\n    </main>\n    \n    <footer>\n        <p>&copy; 2024 Sharada चे Portfolio</p>\n    </footer>\n</body>\n</html>'
  },
]

// ─────────────────────────────────────────
// CSS LESSONS — HINDI (paste after htmlLessonsMarathi)
// ─────────────────────────────────────────
const cssLessons = [
  {
    id: 1,
    title: "CSS क्या है?",
    content: "CSS का पूरा नाम है Cascading Style Sheets। CSS से हम HTML elements को design देते हैं — colors, fonts, spacing, layout सब कुछ CSS से control होता है। अगर HTML एक घर की structure है तो CSS उसका interior design है — वही दीवारों का रंग, furniture की arrangement, और सब कुछ सुंदर बनाने का काम करता है। CSS rules में एक selector होता है जो बताता है किस element को style करना है, और उसके अंदर properties होती हैं जो बताती हैं कैसे style करना है। CSS को तीन तरीकों से HTML में add कर सकते हैं — inline, internal, और external। External CSS सबसे अच्छी practice है क्योंकि code organized रहता है। Cascading का मतलब है कि अगर एक element पर कई rules apply हों, तो कौन सा rule जीतेगा यह specific नियमों से तय होता है।",
    example: null
  },
  {
    id: 2,
    title: "CSS कैसे Add करें — Inline, Internal, External",
    content: "CSS को HTML में जोड़ने के तीन तरीके हैं। Inline CSS किसी एक specific element पर style attribute से लगाते हैं — यह सबसे direct है लेकिन maintain करना मुश्किल होता है। Internal CSS <style> tag के अंदर लिखते हैं जो <head> section में होता है — यह एक पूरे page के लिए होता है। External CSS एक अलग .css file में लिखते हैं और उसे <link> tag से HTML से जोड़ते हैं — यह सबसे best practice है क्योंकि एक CSS file को कई HTML pages share कर सकते हैं और code organized रहता है। Real projects में हमेशा external CSS use करते हैं। rel='stylesheet' attribute बताता है कि linked file एक stylesheet है।",
    example: '<!-- Inline CSS -->\n<p style="color: blue; font-size: 18px;">यह paragraph inline style में है</p>\n\n<!-- Internal CSS -->\n<style>\n    p {\n        color: green;\n    }\n</style>\n\n<!-- External CSS -->\n<link rel="stylesheet" href="style.css">\n\n/* style.css file में: */\np {\n    color: red;\n    font-family: Arial;\n}'
  },
  {
    id: 3,
    title: "Selectors — Elements को Target करना",
    content: "CSS selectors बताते हैं कि कौन से HTML elements को style करना है। Element selector सीधे tag का नाम use करता है जैसे p या h1 — इससे सभी matching elements style होते हैं। Class selector dot से शुरू होता है जैसे .highlight — यह उन सभी elements को style करता है जिनकी class उस नाम की हो। एक class को कई elements पर use कर सकते हैं। ID selector hash से शुरू होता है जैसे #header — यह सिर्फ एक unique element को target करता है क्योंकि एक page में एक id सिर्फ एक बार use होनी चाहिए। Universal selector star से लिखते हैं जो सभी elements को select करता है। Group selector से comma लगाकर कई selectors एक साथ same style दे सकते हैं। Descendant selector space से लिखते हैं जो किसी element के अंदर के elements को target करता है।",
    example: '/* Element selector */\np {\n    color: black;\n}\n\n/* Class selector */\n.highlight {\n    background-color: yellow;\n}\n\n/* ID selector */\n#header {\n    font-size: 24px;\n}\n\n/* Group selector */\nh1, h2, h3 {\n    font-family: Arial;\n}\n\n/* Descendant selector */\ndiv p {\n    color: gray;\n}'
  },
  {
    id: 4,
    title: "Colors और Backgrounds",
    content: "CSS में colors कई तरीकों से लिख सकते हैं। Named colors जैसे red, blue, green सबसे simple हैं। Hex codes # के साथ लिखते हैं जैसे #ff0000 जो लाल रंग है — पहले दो digits red के लिए, अगले दो green के लिए, आखिरी दो blue के लिए। RGB function से rgb(255, 0, 0) लिखते हैं जो भी लाल रंग है। RGBA से transparency भी add कर सकते हैं जैसे rgba(255, 0, 0, 0.5) जहाँ आखिरी value opacity है 0 से 1 के बीच। color property text के रंग के लिए होती है। background-color property background के रंग के लिए होती है। background-image से image background लगाते हैं। background-size से उस image का size control होता है जैसे cover पूरा area भर देता है।",
    example: 'h1 {\n    color: #ff6347;\n}\n\np {\n    color: rgb(50, 50, 50);\n}\n\n.box {\n    background-color: #f0f0f0;\n}\n\n.overlay {\n    background-color: rgba(0, 0, 0, 0.5);\n}\n\n.hero {\n    background-image: url("background.jpg");\n    background-size: cover;\n}'
  },
  {
    id: 5,
    title: "Box Model — Margin, Padding, Border",
    content: "CSS Box Model सबसे important concept है। हर HTML element एक box होता है जिसमें चार layers होती हैं। Content सबसे अंदर होता है — actual text या image। Padding content के चारों ओर की space होती है, यानी content और border के बीच का gap। Border padding के बाहर होता है — एक line जो element को घेरती है। Margin border के बाहर की space होती है यानी एक element और दूसरे element के बीच का gap। padding और margin दोनों में top, right, bottom, left अलग-अलग set कर सकते हैं या shorthand से एक साथ। border-radius से corners को round किया जा सकता है। box-sizing: border-box से padding और border total width में count होते हैं जो layout बनाना आसान बनाता है।",
    example: '.box {\n    width: 300px;\n    padding: 20px;\n    border: 2px solid black;\n    margin: 10px;\n    border-radius: 12px;\n}\n\n/* अलग-अलग sides के लिए */\n.box2 {\n    padding-top: 10px;\n    padding-right: 20px;\n    padding-bottom: 10px;\n    padding-left: 20px;\n}\n\n/* box-sizing से सही width calculation */\n* {\n    box-sizing: border-box;\n}'
  },
  {
    id: 6,
    title: "Text और Font Styling",
    content: "CSS से text को बहुत तरीकों से style कर सकते हैं। font-family से font का नाम set करते हैं — अगर पहला font available नहीं है तो browser अगला try करता है। font-size से text का size set होता है, px, em, या rem में लिख सकते हैं। font-weight से bold या normal set होता है, numbers में भी लिख सकते हैं जैसे 700 जो bold होता है। font-style से italic लगता है। text-align से text center, left, right, या justify हो सकता है। text-decoration से underline, line-through, या none लगता है। line-height से lines के बीच की spacing control होती है जो readability के लिए जरूरी है। letter-spacing से letters के बीच की spacing बढ़ती-घटती है। text-transform से text uppercase, lowercase, या capitalize हो सकता है।",
    example: 'h1 {\n    font-family: \'Segoe UI\', sans-serif;\n    font-size: 32px;\n    font-weight: bold;\n    text-align: center;\n}\n\np {\n    font-size: 16px;\n    line-height: 1.6;\n    color: #333;\n}\n\na {\n    text-decoration: none;\n    color: blue;\n}\n\n.uppercase-text {\n    text-transform: uppercase;\n    letter-spacing: 2px;\n}'
  },
  {
    id: 7,
    title: "Flexbox — Modern Layout",
    content: "Flexbox CSS का सबसे powerful layout system है जो elements को easily align और distribute करता है। Parent element पर display: flex लगाने से वो flex container बन जाता है और उसके सभी children flex items बन जाते हैं। flex-direction से बताते हैं items row में जाएं या column में। justify-content से items को horizontal axis पर align करते हैं — center, space-between, space-around जैसी values होती हैं। align-items से items को vertical axis पर align करते हैं। flex-wrap से items नई line में wrap हो सकते हैं अगर जगह कम हो। gap से items के बीच spacing देते हैं बिना margin use किए। flex-grow से बताते हैं कि कौन सा item extra space ले। Flexbox से centering करना बहुत आसान हो जाता है जो पहले मुश्किल काम था।",
    example: '.container {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 20px;\n}\n\n.center-everything {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n}\n\n.column-layout {\n    display: flex;\n    flex-direction: column;\n}\n\n.item {\n    flex-grow: 1;\n}'
  },
  {
    id: 8,
    title: "CSS Grid — 2D Layout System",
    content: "CSS Grid एक powerful 2D layout system है जो rows और columns दोनों को एक साथ control करता है। display: grid लगाने से element grid container बन जाता है। grid-template-columns से columns की संख्या और size set करते हैं — fr unit fraction के लिए होता है जो available space को बराबर बांटता है। grid-template-rows से rows define करते हैं। gap property से grid items के बीच spacing देते हैं। grid-column और grid-row से किसी item को कई columns या rows में span करा सकते हैं। Grid layouts के लिए perfect है जैसे image galleries, dashboards, या complex page layouts। repeat() function से बार-बार same size के columns/rows बनाना आसान होता है। Flexbox 1D layout के लिए है जबकि Grid 2D layout के लिए — दोनों साथ भी use हो सकते हैं।",
    example: '.gallery {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 15px;\n}\n\n.dashboard {\n    display: grid;\n    grid-template-columns: 200px 1fr;\n    grid-template-rows: 60px 1fr;\n}\n\n.featured-item {\n    grid-column: span 2;\n}\n\n.full-width {\n    grid-column: 1 / -1;\n}'
  },
  {
    id: 9,
    title: "Responsive Design — Media Queries",
    content: "Responsive design से website हर screen size पर अच्छी दिखती है — चाहे mobile हो, tablet हो, या desktop हो। Media queries CSS की feature है जो screen size के हिसाब से अलग styles apply करती है। @media (max-width: 768px) का मतलब है यह styles तभी apply होंगी जब screen width 768px या उससे कम हो। Mobile-first approach में पहले mobile के लिए style लिखते हैं फिर बड़ी screens के लिए min-width media queries लिखते हैं। viewport meta tag <meta name='viewport' content='width=device-width, initial-scale=1'> हर responsive website में जरूरी है। Flexible units जैसे %, vw, vh, em, rem fixed px से बेहतर हैं responsive design के लिए। Breakpoints common screen sizes होते हैं जहाँ layout बदलता है — आमतौर पर 480px, 768px, 1024px पर।",
    example: '/* Mobile-first base styles */\n.container {\n    width: 100%;\n    padding: 10px;\n}\n\n/* Tablet — 768px और बड़ा */\n@media (min-width: 768px) {\n    .container {\n        width: 750px;\n        margin: 0 auto;\n    }\n}\n\n/* Desktop — 1024px और बड़ा */\n@media (min-width: 1024px) {\n    .container {\n        width: 1000px;\n    }\n    \n    .sidebar {\n        display: block;\n    }\n}\n\n/* Mobile पर sidebar hide करें */\n.sidebar {\n    display: none;\n}'
  },
  {
    id: 10,
    title: "CSS Transitions और Mini Project",
    content: "शाबाश! आपने CSS के सभी important concepts सीख लिए। Transitions से CSS properties smoothly बदलती हैं instead of तुरंत jump करने के। transition property में बताते हैं कौन सी property animate होगी, कितनी देर में, और कैसे। hover pseudo-class से किसी element पर mouse आने पर style बदलती है। यह बहुत common है buttons और links के लिए। transform property से elements को move, rotate, scale, या skew कर सकते हैं transition के साथ मिलकर। अब हम सब कुछ मिलाकर एक responsive card component बनाएंगे जिसमें box model, flexbox, hover effects, और transitions सब use होंगे। यह project आपको दिखाएगा कि real websites में CSS कैसे काम आता है।",
    example: '.card {\n    width: 280px;\n    padding: 20px;\n    border-radius: 12px;\n    box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n    transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.card:hover {\n    transform: translateY(-8px);\n    box-shadow: 0 8px 20px rgba(0,0,0,0.2);\n}\n\n.card-button {\n    background-color: #1cb0f6;\n    color: white;\n    padding: 10px 20px;\n    border: none;\n    border-radius: 8px;\n    cursor: pointer;\n    transition: background-color 0.2s ease;\n}\n\n.card-button:hover {\n    background-color: #0a8fd4;\n}\n\n@media (max-width: 480px) {\n    .card {\n        width: 100%;\n    }\n}'
  },
]

// ─────────────────────────────────────────
// CSS LESSONS — ENGLISH
// ─────────────────────────────────────────
const cssLessonsEnglish = [
  {
    id: 1,
    title: "What is CSS?",
    content: "CSS stands for Cascading Style Sheets. CSS is used to style HTML elements — colors, fonts, spacing, layout, everything is controlled by CSS. If HTML is the structure of a house then CSS is its interior design — the wall colors, furniture arrangement, and everything that makes it look beautiful. A CSS rule has a selector that says which element to style, and inside it has properties that say how to style it. There are three ways to add CSS to HTML — inline, internal, and external. External CSS is the best practice because it keeps code organized. Cascading means that if multiple rules apply to the same element, a specific set of rules decides which one wins.",
    example: null
  },
  {
    id: 2,
    title: "How to Add CSS — Inline, Internal, External",
    content: "There are three ways to add CSS to HTML. Inline CSS is added directly to a specific element using the style attribute — it is the most direct but hard to maintain. Internal CSS is written inside a style tag placed in the head section — it applies to the whole page. External CSS is written in a separate .css file and linked to the HTML using the link tag — this is the best practice because one CSS file can be shared across many HTML pages and the code stays organized. Real projects almost always use external CSS. The rel equals stylesheet attribute tells the browser that the linked file is a stylesheet.",
    example: '<!-- Inline CSS -->\n<p style="color: blue; font-size: 18px;">This paragraph is styled inline</p>\n\n<!-- Internal CSS -->\n<style>\n    p {\n        color: green;\n    }\n</style>\n\n<!-- External CSS -->\n<link rel="stylesheet" href="style.css">\n\n/* In style.css: */\np {\n    color: red;\n    font-family: Arial;\n}'
  },
  {
    id: 3,
    title: "Selectors — Targeting Elements",
    content: "CSS selectors tell the browser which HTML elements to style. An element selector uses the tag name directly, like p or h1, and applies to every matching element. A class selector starts with a dot, like .highlight, and applies to every element that has that class. A single class can be applied to many elements. An ID selector starts with a hash, like #header, and targets only one unique element, since an id should only be used once per page. The universal selector is written as an asterisk and selects every element. A group selector uses commas to apply the same style to several selectors at once. A descendant selector is written with a space and targets elements that live inside another element.",
    example: '/* Element selector */\np {\n    color: black;\n}\n\n/* Class selector */\n.highlight {\n    background-color: yellow;\n}\n\n/* ID selector */\n#header {\n    font-size: 24px;\n}\n\n/* Group selector */\nh1, h2, h3 {\n    font-family: Arial;\n}\n\n/* Descendant selector */\ndiv p {\n    color: gray;\n}'
  },
  {
    id: 4,
    title: "Colors and Backgrounds",
    content: "CSS colors can be written in several ways. Named colors like red, blue, or green are the simplest. Hex codes start with a hash and look like #ff0000 for red — the first two digits are red, the next two are green, and the last two are blue. The rgb function lets you write rgb(255, 0, 0) which is also red. The rgba function adds transparency, for example rgba(255, 0, 0, 0.5), where the last value is opacity between 0 and 1. The color property controls text color. The background-color property controls the background color of an element. background-image places an image as a background. background-size controls how that image is sized, for example cover fills the entire area.",
    example: 'h1 {\n    color: #ff6347;\n}\n\np {\n    color: rgb(50, 50, 50);\n}\n\n.box {\n    background-color: #f0f0f0;\n}\n\n.overlay {\n    background-color: rgba(0, 0, 0, 0.5);\n}\n\n.hero {\n    background-image: url("background.jpg");\n    background-size: cover;\n}'
  },
  {
    id: 5,
    title: "Box Model — Margin, Padding, Border",
    content: "The CSS Box Model is one of the most important concepts. Every HTML element is a box made up of four layers. Content is innermost — the actual text or image. Padding is the space around the content, the gap between the content and the border. Border sits outside the padding — a line that surrounds the element. Margin is the space outside the border, the gap between this element and the next one. Both padding and margin can be set separately for top, right, bottom, and left, or all at once using shorthand. border-radius rounds the corners of an element. Setting box-sizing to border-box makes padding and border count inside the total width, which makes building layouts much easier.",
    example: '.box {\n    width: 300px;\n    padding: 20px;\n    border: 2px solid black;\n    margin: 10px;\n    border-radius: 12px;\n}\n\n.box2 {\n    padding-top: 10px;\n    padding-right: 20px;\n    padding-bottom: 10px;\n    padding-left: 20px;\n}\n\n* {\n    box-sizing: border-box;\n}'
  },
  {
    id: 6,
    title: "Text and Font Styling",
    content: "CSS can style text in many ways. font-family sets the font name — if the first font isn't available, the browser falls back to the next one in the list. font-size sets the size of text and can be written in px, em, or rem. font-weight sets bold or normal, and can also be a number like 700 for bold. font-style is used for italics. text-align can center, left, right, or justify text. text-decoration adds underline, line-through, or none. line-height controls the spacing between lines, which is important for readability. letter-spacing increases or decreases the space between letters. text-transform can make text uppercase, lowercase, or capitalize the first letter of each word.",
    example: 'h1 {\n    font-family: \'Segoe UI\', sans-serif;\n    font-size: 32px;\n    font-weight: bold;\n    text-align: center;\n}\n\np {\n    font-size: 16px;\n    line-height: 1.6;\n    color: #333;\n}\n\na {\n    text-decoration: none;\n    color: blue;\n}\n\n.uppercase-text {\n    text-transform: uppercase;\n    letter-spacing: 2px;\n}'
  },
  {
    id: 7,
    title: "Flexbox — Modern Layout",
    content: "Flexbox is the most powerful CSS layout system for easily aligning and distributing elements. Setting display flex on a parent turns it into a flex container and all its children become flex items. flex-direction decides whether items flow in a row or a column. justify-content aligns items along the horizontal axis, with values like center, space-between, and space-around. align-items aligns items along the vertical axis. flex-wrap allows items to wrap onto a new line if there isn't enough space. gap adds spacing between items without using margin. flex-grow decides which item takes up extra available space. Flexbox makes centering elements, which used to be tricky, extremely easy.",
    example: '.container {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 20px;\n}\n\n.center-everything {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n}\n\n.column-layout {\n    display: flex;\n    flex-direction: column;\n}\n\n.item {\n    flex-grow: 1;\n}'
  },
  {
    id: 8,
    title: "CSS Grid — 2D Layout System",
    content: "CSS Grid is a powerful 2D layout system that controls both rows and columns at the same time. Setting display grid on an element turns it into a grid container. grid-template-columns sets the number and size of columns — the fr unit stands for fraction and divides available space evenly. grid-template-rows defines rows. The gap property adds spacing between grid items. grid-column and grid-row let an item span across multiple columns or rows. Grid is perfect for layouts like image galleries, dashboards, or complex page structures. The repeat() function makes it easy to create many columns or rows of the same size. Flexbox is for 1D layout while Grid is for 2D layout — they can also be used together.",
    example: '.gallery {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 15px;\n}\n\n.dashboard {\n    display: grid;\n    grid-template-columns: 200px 1fr;\n    grid-template-rows: 60px 1fr;\n}\n\n.featured-item {\n    grid-column: span 2;\n}\n\n.full-width {\n    grid-column: 1 / -1;\n}'
  },
  {
    id: 9,
    title: "Responsive Design — Media Queries",
    content: "Responsive design makes a website look good on every screen size, whether mobile, tablet, or desktop. Media queries are a CSS feature that applies different styles based on screen size. Writing @media (max-width: 768px) means these styles only apply when the screen width is 768px or less. A mobile-first approach means writing styles for mobile first and then using min-width media queries for larger screens. The viewport meta tag is essential for every responsive website. Flexible units like %, vw, vh, em, and rem work better for responsive design than fixed pixel values. Breakpoints are common screen sizes where the layout changes, typically around 480px, 768px, and 1024px.",
    example: '/* Mobile-first base styles */\n.container {\n    width: 100%;\n    padding: 10px;\n}\n\n/* Tablet — 768px and up */\n@media (min-width: 768px) {\n    .container {\n        width: 750px;\n        margin: 0 auto;\n    }\n}\n\n/* Desktop — 1024px and up */\n@media (min-width: 1024px) {\n    .container {\n        width: 1000px;\n    }\n    \n    .sidebar {\n        display: block;\n    }\n}\n\n/* Hide sidebar on mobile */\n.sidebar {\n    display: none;\n}'
  },
  {
    id: 10,
    title: "CSS Transitions and Mini Project",
    content: "Congratulations! You have learned all the important concepts of CSS. Transitions make CSS properties change smoothly instead of jumping instantly. The transition property specifies which property to animate, how long it takes, and how it eases. The hover pseudo-class changes the style of an element when the mouse moves over it, very commonly used for buttons and links. The transform property lets elements move, rotate, scale, or skew, and works especially well combined with transitions. Now we will combine everything to build a responsive card component using the box model, flexbox, hover effects, and transitions all together. This project shows you how CSS is used in real websites.",
    example: '.card {\n    width: 280px;\n    padding: 20px;\n    border-radius: 12px;\n    box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n    transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.card:hover {\n    transform: translateY(-8px);\n    box-shadow: 0 8px 20px rgba(0,0,0,0.2);\n}\n\n.card-button {\n    background-color: #1cb0f6;\n    color: white;\n    padding: 10px 20px;\n    border: none;\n    border-radius: 8px;\n    cursor: pointer;\n    transition: background-color 0.2s ease;\n}\n\n.card-button:hover {\n    background-color: #0a8fd4;\n}\n\n@media (max-width: 480px) {\n    .card {\n        width: 100%;\n    }\n}'
  },
]

// ─────────────────────────────────────────
// CSS LESSONS — MARATHI
// ─────────────────────────────────────────
const cssLessonsMarathi = [
  {
    id: 1,
    title: "CSS म्हणजे काय?",
    content: "CSS चे पूर्ण नाव आहे Cascading Style Sheets. CSS ने आपण HTML elements ला design देतो — colors, fonts, spacing, layout सर्व काही CSS ने control होते. जर HTML हे घराचे structure असेल तर CSS त्याचे interior design आहे — तीच भिंतींचा रंग, furniture ची arrangement, आणि सर्व काही सुंदर बनवण्याचे काम करते. CSS rule मध्ये एक selector असतो जो सांगतो कोणत्या element ला style करायचे, आणि त्याच्या आत properties असतात ज्या सांगतात कसे style करायचे. CSS ला तीन प्रकारे HTML मध्ये add करता येते — inline, internal, आणि external. External CSS सर्वात चांगली practice आहे कारण code organized राहतो. Cascading म्हणजे जर एका element वर अनेक rules apply होत असतील, तर कोणता rule जिंकेल हे specific नियमांनी ठरते.",
    example: null
  },
  {
    id: 2,
    title: "CSS कसे Add करावे — Inline, Internal, External",
    content: "CSS ला HTML मध्ये जोडण्याचे तीन मार्ग आहेत. Inline CSS एखाद्या specific element वर style attribute ने लावतात — हे सर्वात direct आहे पण maintain करणे कठीण आहे. Internal CSS style tag च्या आत लिहतात जो head section मध्ये असतो — हे संपूर्ण page साठी असते. External CSS एका वेगळ्या .css file मध्ये लिहतात आणि link tag ने HTML शी जोडतात — ही सर्वात best practice आहे कारण एक CSS file अनेक HTML pages share करू शकतात आणि code organized राहतो. Real projects मध्ये नेहमी external CSS वापरतात. rel='stylesheet' attribute सांगतो की linked file एक stylesheet आहे.",
    example: '<!-- Inline CSS -->\n<p style="color: blue; font-size: 18px;">हा paragraph inline style मध्ये आहे</p>\n\n<!-- Internal CSS -->\n<style>\n    p {\n        color: green;\n    }\n</style>\n\n<!-- External CSS -->\n<link rel="stylesheet" href="style.css">\n\n/* style.css file मध्ये: */\np {\n    color: red;\n    font-family: Arial;\n}'
  },
  {
    id: 3,
    title: "Selectors — Elements ला Target करणे",
    content: "CSS selectors सांगतात कोणत्या HTML elements ला style करायचे. Element selector थेट tag चे नाव वापरतो जसे p किंवा h1 — यामुळे सर्व matching elements style होतात. Class selector dot ने सुरू होतो जसे .highlight — हा त्या सर्व elements ला style करतो ज्यांची class त्या नावाची आहे. एक class अनेक elements वर वापरता येतो. ID selector hash ने सुरू होतो जसे #header — हा फक्त एका unique element ला target करतो कारण एका page मध्ये एक id फक्त एकदाच वापरायला हवी. Universal selector star ने लिहतात जो सर्व elements select करतो. Group selector ने comma लावून अनेक selectors ला एकत्र same style देता येतो. Descendant selector space ने लिहतात जो एखाद्या element च्या आतील elements ला target करतो.",
    example: '/* Element selector */\np {\n    color: black;\n}\n\n/* Class selector */\n.highlight {\n    background-color: yellow;\n}\n\n/* ID selector */\n#header {\n    font-size: 24px;\n}\n\n/* Group selector */\nh1, h2, h3 {\n    font-family: Arial;\n}\n\n/* Descendant selector */\ndiv p {\n    color: gray;\n}'
  },
  {
    id: 4,
    title: "Colors आणि Backgrounds",
    content: "CSS मध्ये colors अनेक प्रकारे लिहता येतात. Named colors जसे red, blue, green सर्वात simple आहेत. Hex codes # सोबत लिहतात जसे #ff0000 जो लाल रंग आहे — पहिले दोन digits red साठी, पुढचे दोन green साठी, शेवटचे दोन blue साठी. RGB function ने rgb(255, 0, 0) लिहतात जो देखील लाल रंग आहे. RGBA ने transparency देखील add करता येते जसे rgba(255, 0, 0, 0.5) जिथे शेवटची value opacity आहे 0 ते 1 च्या मध्ये. color property text च्या रंगासाठी असते. background-color property background च्या रंगासाठी असते. background-image ने image background लावतात. background-size ने त्या image चा size control होतो जसे cover पूर्ण area भरते.",
    example: 'h1 {\n    color: #ff6347;\n}\n\np {\n    color: rgb(50, 50, 50);\n}\n\n.box {\n    background-color: #f0f0f0;\n}\n\n.overlay {\n    background-color: rgba(0, 0, 0, 0.5);\n}\n\n.hero {\n    background-image: url("background.jpg");\n    background-size: cover;\n}'
  },
  {
    id: 5,
    title: "Box Model — Margin, Padding, Border",
    content: "CSS Box Model हा सर्वात महत्त्वाचा concept आहे. प्रत्येक HTML element एक box असतो ज्यात चार layers असतात. Content सर्वात आत असतो — actual text किंवा image. Padding content च्या भोवतालची space असते, म्हणजे content आणि border च्या मधील gap. Border padding च्या बाहेर असतो — एक line जी element ला घेरते. Margin border च्या बाहेरची space असते म्हणजे एका element आणि दुसऱ्या element मधील gap. padding आणि margin दोन्हीमध्ये top, right, bottom, left वेगवेगळे set करता येतात किंवा shorthand ने एकत्र. border-radius ने corners round करता येतात. box-sizing: border-box ने padding आणि border total width मध्ये count होतात जे layout बनवणे सोपे करते.",
    example: '.box {\n    width: 300px;\n    padding: 20px;\n    border: 2px solid black;\n    margin: 10px;\n    border-radius: 12px;\n}\n\n.box2 {\n    padding-top: 10px;\n    padding-right: 20px;\n    padding-bottom: 10px;\n    padding-left: 20px;\n}\n\n* {\n    box-sizing: border-box;\n}'
  },
  {
    id: 6,
    title: "Text आणि Font Styling",
    content: "CSS ने text ला अनेक प्रकारे style करता येते. font-family ने font चे नाव set करतात — जर पहिला font available नसेल तर browser पुढचा try करतो. font-size ने text चा size set होतो, px, em, किंवा rem मध्ये लिहता येते. font-weight ने bold किंवा normal set होते, numbers मध्ये देखील लिहता येते जसे 700 जो bold आहे. font-style ने italic लागते. text-align ने text center, left, right, किंवा justify होऊ शकतो. text-decoration ने underline, line-through, किंवा none लागते. line-height ने lines च्या मधील spacing control होते जे readability साठी आवश्यक आहे. letter-spacing ने letters च्या मधील spacing वाढते-कमी होते. text-transform ने text uppercase, lowercase, किंवा capitalize होऊ शकतो.",
    example: 'h1 {\n    font-family: \'Segoe UI\', sans-serif;\n    font-size: 32px;\n    font-weight: bold;\n    text-align: center;\n}\n\np {\n    font-size: 16px;\n    line-height: 1.6;\n    color: #333;\n}\n\na {\n    text-decoration: none;\n    color: blue;\n}\n\n.uppercase-text {\n    text-transform: uppercase;\n    letter-spacing: 2px;\n}'
  },
  {
    id: 7,
    title: "Flexbox — Modern Layout",
    content: "Flexbox हे CSS चे सर्वात powerful layout system आहे जे elements ला सहज align आणि distribute करते. Parent element वर display: flex लावल्याने तो flex container बनतो आणि त्याचे सर्व children flex items बनतात. flex-direction ने सांगतात items row मध्ये जातील की column मध्ये. justify-content ने items ला horizontal axis वर align करतात — center, space-between, space-around सारख्या values असतात. align-items ने items ला vertical axis वर align करतात. flex-wrap ने items नवीन line मध्ये wrap होऊ शकतात जर जागा कमी असेल. gap ने items च्या मधील spacing देतात margin न वापरता. flex-grow ने सांगतात कोणता item extra space घेईल. Flexbox मुळे centering करणे खूप सोपे होते जे आधी कठीण काम होते.",
    example: '.container {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 20px;\n}\n\n.center-everything {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n}\n\n.column-layout {\n    display: flex;\n    flex-direction: column;\n}\n\n.item {\n    flex-grow: 1;\n}'
  },
  {
    id: 8,
    title: "CSS Grid — 2D Layout System",
    content: "CSS Grid हे एक powerful 2D layout system आहे जे rows आणि columns दोन्ही एकत्र control करते. display: grid लावल्याने element grid container बनतो. grid-template-columns ने columns ची संख्या आणि size set करतात — fr unit fraction साठी असतो जो available space समान वाटतो. grid-template-rows ने rows define करतात. gap property ने grid items च्या मधील spacing देतात. grid-column आणि grid-row ने एखाद्या item ला अनेक columns किंवा rows मध्ये span करता येते. Grid layouts साठी perfect आहे जसे image galleries, dashboards, किंवा complex page layouts. repeat() function ने वारंवार same size च्या columns/rows बनवणे सोपे होते. Flexbox 1D layout साठी आहे तर Grid 2D layout साठी — दोन्ही एकत्र देखील वापरता येतात.",
    example: '.gallery {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 15px;\n}\n\n.dashboard {\n    display: grid;\n    grid-template-columns: 200px 1fr;\n    grid-template-rows: 60px 1fr;\n}\n\n.featured-item {\n    grid-column: span 2;\n}\n\n.full-width {\n    grid-column: 1 / -1;\n}'
  },
  {
    id: 9,
    title: "Responsive Design — Media Queries",
    content: "Responsive design मुळे website प्रत्येक screen size वर चांगली दिसते — मग ते mobile असो, tablet असो, किंवा desktop असो. Media queries ही CSS ची feature आहे जी screen size नुसार वेगवेगळे styles apply करते. @media (max-width: 768px) म्हणजे हे styles तेव्हाच apply होतील जेव्हा screen width 768px किंवा त्यापेक्षा कमी असेल. Mobile-first approach मध्ये आधी mobile साठी style लिहतात मग मोठ्या screens साठी min-width media queries लिहतात. viewport meta tag प्रत्येक responsive website साठी आवश्यक आहे. Flexible units जसे %, vw, vh, em, rem fixed px पेक्षा चांगले आहेत responsive design साठी. Breakpoints म्हणजे common screen sizes जिथे layout बदलतो — साधारणपणे 480px, 768px, 1024px वर.",
    example: '/* Mobile-first base styles */\n.container {\n    width: 100%;\n    padding: 10px;\n}\n\n/* Tablet — 768px आणि मोठे */\n@media (min-width: 768px) {\n    .container {\n        width: 750px;\n        margin: 0 auto;\n    }\n}\n\n/* Desktop — 1024px आणि मोठे */\n@media (min-width: 1024px) {\n    .container {\n        width: 1000px;\n    }\n    \n    .sidebar {\n        display: block;\n    }\n}\n\n/* Mobile वर sidebar hide करा */\n.sidebar {\n    display: none;\n}'
  },
  {
    id: 10,
    title: "CSS Transitions आणि Mini Project",
    content: "शाब्बास! तुम्ही CSS चे सर्व महत्त्वाचे concepts शिकलात. Transitions मुळे CSS properties smoothly बदलतात instead of लगेच jump करण्याऐवजी. transition property मध्ये सांगतात कोणती property animate होईल, किती वेळात, आणि कशी. hover pseudo-class ने एखाद्या element वर mouse आल्यावर style बदलते. हे खूप common आहे buttons आणि links साठी. transform property ने elements ला move, rotate, scale, किंवा skew करता येते transition सोबत मिळून. आता आपण सर्व एकत्र करून एक responsive card component बनवूया ज्यात box model, flexbox, hover effects, आणि transitions सर्व वापरले जातील. हे project तुम्हाला दाखवेल की real websites मध्ये CSS कसे उपयोगी पडते.",
    example: '.card {\n    width: 280px;\n    padding: 20px;\n    border-radius: 12px;\n    box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n    transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.card:hover {\n    transform: translateY(-8px);\n    box-shadow: 0 8px 20px rgba(0,0,0,0.2);\n}\n\n.card-button {\n    background-color: #1cb0f6;\n    color: white;\n    padding: 10px 20px;\n    border: none;\n    border-radius: 8px;\n    cursor: pointer;\n    transition: background-color 0.2s ease;\n}\n\n.card-button:hover {\n    background-color: #0a8fd4;\n}\n\n@media (max-width: 480px) {\n    .card {\n        width: 100%;\n    }\n}'
  },
]

// ─────────────────────────────────────────
// TAILWIND CSS LESSONS — HINDI (paste after cssLessonsMarathi)
// ─────────────────────────────────────────
const tailwindLessons = [
  {
    id: 1,
    title: "Tailwind CSS क्या है?",
    content: "Tailwind CSS एक utility-first CSS framework है जो modern web development में बहुत popular हो गया है। Traditional CSS में हम अपने खुद के class names बनाते हैं जैसे .card या .button और फिर एक अलग file में उनकी styling लिखते हैं। Tailwind में इसके बजाय छोटी-छोटी pre-built utility classes होती हैं जैसे text-center, bg-blue-500, या p-4 जिन्हें सीधे HTML में लगाते हैं। हर class एक single CSS property करती है। इससे बार-बार CSS file में जाने की जरूरत नहीं पड़ती और development बहुत fast हो जाता है। Tailwind को Adam Wathan ने बनाया था। बड़ी companies जैसे GitHub, Shopify, और Netflix भी Tailwind use करती हैं क्योंकि यह consistency और speed दोनों देता है।",
    example: null
  },
  {
    id: 2,
    title: "Tailwind को Setup करना",
    content: "Tailwind को अपने project में add करने के कई तरीके हैं। सबसे आसान तरीका है CDN link use करना जो quick testing के लिए perfect है — बस एक <script> tag <head> में add करते हैं। Production projects में npm के through install करते हैं — npm install tailwindcss से package मिलता है। फिर tailwind.config.js file बनती है जो customization के लिए होती है। एक main CSS file में तीन directives लिखते हैं — @tailwind base, @tailwind components, @tailwind utilities। Build process इन्हें असली CSS में convert करता है। Modern frameworks जैसे React, Next.js, और Vite में Tailwind का integration बहुत smooth है। यह automatically सिर्फ used classes को final CSS में include करता है जिससे file size छोटी रहती है।",
    example: '<!-- Quick testing के लिए CDN -->\n<script src="https://cdn.tailwindcss.com"></script>\n\n<!-- फिर सीधे HTML में classes use करें -->\n<h1 class="text-3xl font-bold text-blue-600">\n    नमस्ते Tailwind!\n</h1>\n\n<!-- npm install के बाद CSS file में -->\n@tailwind base;\n@tailwind components;\n@tailwind utilities;'
  },
  {
    id: 3,
    title: "Spacing — Padding और Margin",
    content: "Tailwind में spacing के लिए numbers based scale होता है। p से padding लगती है और m से margin। p-4 का मतलब है padding सभी तरफ 1rem यानी 16px। हर number 0.25rem यानी 4px के multiples में होता है — तो p-1 है 4px, p-2 है 8px, p-4 है 16px। सिर्फ specific sides के लिए: pt top padding, pb bottom, pl left, pr right। px से left-right दोनों, py से top-bottom दोनों। Margin के लिए भी same pattern है m, mt, mb, ml, mr, mx, my। Negative margin के लिए -mt-4 जैसे लिखते हैं। gap property से flex या grid items के बीच spacing देते हैं — gap-4 से 16px gap मिलता है। यह pattern सीखने के बाद spacing values याद रखना बहुत आसान हो जाता है।",
    example: '<div class="p-4 m-2">\n    Padding 16px, Margin 8px\n</div>\n\n<div class="px-6 py-3">\n    Horizontal 24px, Vertical 12px\n</div>\n\n<div class="pt-8 pb-2 pl-4 pr-4">\n    अलग-अलग sides की padding\n</div>\n\n<div class="flex gap-4">\n    <div>Item 1</div>\n    <div>Item 2</div>\n</div>'
  },
  {
    id: 4,
    title: "Colors और Background",
    content: "Tailwind में हर color के 10 अलग-अलग shades होते हैं 50 से 900 तक — 50 सबसे हल्का होता है और 900 सबसे गहरा। text-blue-500 से text का रंग blue मध्यम shade में होता है। bg-red-100 से बहुत हल्का लाल background मिलता है। bg-green-700 से गहरा हरा background मिलता है। border-gray-300 से border का रंग set होता है। Tailwind के default colors में slate, gray, red, orange, yellow, green, blue, purple, pink जैसे बहुत सारे color families होते हैं। hover: prefix से hover state के लिए अलग color दे सकते हैं जैसे hover:bg-blue-600। opacity control करने के लिए bg-blue-500/50 लिख सकते हैं जो 50% opacity देता है। यह system consistent design बनाने में बहुत मदद करता है।",
    example: '<div class="bg-blue-500 text-white p-4">\n    Blue background, white text\n</div>\n\n<button class="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded">\n    Hover करने पर रंग बदलेगा\n</button>\n\n<div class="bg-gray-100 border border-gray-300 p-4">\n    Light gray background with border\n</div>\n\n<div class="bg-purple-500/30 p-4">\n    30% opacity वाला purple\n</div>'
  },
  {
    id: 5,
    title: "Typography — Text Styling",
    content: "Tailwind में text styling के लिए simple classes हैं। Font size के लिए text-xs से text-9xl तक classes होते हैं — text-sm छोटा है, text-xl बड़ा है, text-4xl और भी बड़ा। font-bold से bold text मिलता है, font-normal normal weight देता है, font-light हल्का text देता है। text-center, text-left, text-right से alignment होती है। leading- classes line-height control करते हैं जैसे leading-tight या leading-loose। tracking- classes letter-spacing control करते हैं। underline से underline लगता है, line-through से strikethrough। truncate से लंबा text एक line में ... के साथ cut हो जाता है। italic class से text तिरछा होता है। ये सभी classes सीधे tag में लिखते हैं जो traditional CSS से कहीं ज्यादा fast है।",
    example: '<h1 class="text-4xl font-bold text-center">\n    बड़ी Bold Heading\n</h1>\n\n<p class="text-sm text-gray-600 leading-relaxed">\n    यह छोटा text है loose line height के साथ\n</p>\n\n<p class="truncate w-48">\n    यह बहुत लंबा text है जो cut हो जाएगा...\n</p>\n\n<a href="#" class="underline text-blue-600 hover:text-blue-800">\n    Link with underline\n</a>'
  },
  {
    id: 6,
    title: "Flexbox Utilities",
    content: "Tailwind में flexbox बहुत आसानी से use हो जाता है। flex class से element flex container बनता है। flex-row default direction है, flex-col से column direction मिलती है। justify-center, justify-between, justify-around horizontal alignment के लिए हैं। items-center, items-start, items-end vertical alignment के लिए हैं। flex-wrap से items wrap हो सकते हैं। flex-1 से item बाकी space ले लेता है। gap-x और gap-y से horizontal और vertical gap अलग-अलग set कर सकते हैं। एक common pattern है flex justify-center items-center जो किसी भी content को perfectly center कर देता है — यह traditional CSS में काफी मुश्किल काम था लेकिन Tailwind में सिर्फ कुछ classes से हो जाता है।",
    example: '<div class="flex justify-center items-center h-screen">\n    <p>यह बिल्कुल center में है</p>\n</div>\n\n<div class="flex justify-between items-center p-4">\n    <span>बाएं</span>\n    <span>दाएं</span>\n</div>\n\n<div class="flex flex-col gap-2">\n    <div>Item 1</div>\n    <div>Item 2</div>\n    <div>Item 3</div>\n</div>\n\n<div class="flex flex-wrap gap-4">\n    <div class="flex-1">Grows</div>\n    <div class="flex-1">Equal</div>\n</div>'
  },
  {
    id: 7,
    title: "Grid Utilities",
    content: "Tailwind में CSS Grid भी आसान utilities के साथ मिलता है। grid class से element grid container बनता है। grid-cols-3 से तीन equal columns बनते हैं — number 1 से 12 तक हो सकता है। grid-rows-2 से दो rows define होती हैं। col-span-2 से कोई item दो columns में फैल जाता है। row-span-2 से item दो rows में फैलता है। gap-4 से grid items के बीच spacing मिलती है, gap-x और gap-y अलग से control होते हैं। Responsive design के लिए md:grid-cols-3 जैसे prefixes use करते हैं जो सिर्फ medium screens और बड़ी पर apply होते हैं। grid-cols-none से grid हटाई जा सकती है। Grid layouts photo galleries, dashboards, और card layouts के लिए perfect हैं।",
    example: '<div class="grid grid-cols-3 gap-4">\n    <div class="bg-blue-200 p-4">1</div>\n    <div class="bg-blue-200 p-4">2</div>\n    <div class="bg-blue-200 p-4">3</div>\n</div>\n\n<div class="grid grid-cols-4 gap-2">\n    <div class="col-span-2 bg-green-200 p-4">2 columns wide</div>\n    <div class="bg-green-200 p-4">1</div>\n    <div class="bg-green-200 p-4">1</div>\n</div>\n\n<!-- Responsive grid -->\n<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\n    <div>Mobile: 1 col, Tablet: 2, Desktop: 3</div>\n</div>'
  },
  {
    id: 8,
    title: "Responsive Design Prefixes",
    content: "Tailwind का responsive system बहुत intuitive है। Default classes mobile के लिए होती हैं — यह mobile-first approach है। Bigger screens के लिए breakpoint prefixes use करते हैं। sm: 640px और बड़ी screens के लिए, md: 768px और बड़ी के लिए, lg: 1024px और बड़ी के लिए, xl: 1280px और बड़ी के लिए, 2xl: 1536px और बड़ी के लिए। जैसे text-sm md:text-lg lg:text-2xl का मतलब है mobile पर small text, tablet पर large text, desktop पर extra-large text। इस approach से एक ही HTML element में सभी screen sizes के लिए styling लिख सकते हैं बिना अलग media queries लिखे। यह बहुत powerful feature है क्योंकि पूरा responsive design सीधे class names में दिख जाता है, अलग CSS file खोलने की जरूरत नहीं।",
    example: '<div class="text-sm md:text-lg lg:text-2xl">\n    Screen size के हिसाब से text size बदलता है\n</div>\n\n<div class="w-full md:w-1/2 lg:w-1/3">\n    Mobile: full width, Tablet: half, Desktop: एक तिहाई\n</div>\n\n<div class="hidden md:block">\n    सिर्फ tablet और बड़ी screens पर दिखेगा\n</div>\n\n<div class="block md:hidden">\n    सिर्फ mobile पर दिखेगा\n</div>'
  },
  {
    id: 9,
    title: "Hover, Focus और State Variants",
    content: "Tailwind में interactive states के लिए special prefixes होते हैं। hover: से mouse आने पर style बदलती है — hover:bg-blue-700। focus: से input field पर focus आने पर style बदलती है, forms में बहुत useful है — focus:border-blue-500 focus:outline-none। active: से click होने के दौरान style मिलती है। disabled: से disabled elements के लिए अलग styling होती है। group hover के लिए group class parent पर लगाते हैं और group-hover: child elements पर — इससे parent hover करने पर child भी style बदलता है। dark: prefix से dark mode के लिए अलग styles दे सकते हैं। transition और duration- classes से ये state changes smooth animate होती हैं — transition-colors duration-300 से रंग 300 milliseconds में smoothly बदलता है।",
    example: '<button class="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 text-white px-4 py-2 rounded transition-colors duration-300">\n    Hover और click करें\n</button>\n\n<input class="border border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded" placeholder="यहाँ click करें">\n\n<div class="group p-4 border rounded">\n    <h3 class="group-hover:text-blue-600">Parent पर hover करें</h3>\n    <p class="group-hover:text-blue-400">यह text भी बदलेगा</p>\n</div>'
  },
  {
    id: 10,
    title: "Mini Project — Responsive Card Component",
    content: "शाबाश! आपने Tailwind CSS के सभी important concepts सीख लिए। अब हम सब कुछ मिलाकर एक complete responsive card component बनाएंगे जिसमें spacing, colors, typography, flexbox, hover effects, और responsive design — सब use होगा। यह project दिखाएगा कि कैसे real production websites Tailwind से fast और consistent तरीके से बनती हैं। इस card में image, title, description, और button होगा जो सभी screen sizes पर अच्छी दिखेगी। Tailwind सीखने के बाद आप किसी भी UI को बहुत तेज़ी से बना सकते हैं क्योंकि traditional CSS file लिखने की जरूरत नहीं पड़ती — सब कुछ HTML classes में ही हो जाता है।",
    example: '<div class="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 m-4">\n    <img class="w-full h-48 object-cover" src="course.jpg" alt="Course image">\n    \n    <div class="p-6">\n        <h2 class="text-xl font-bold text-gray-800 mb-2">\n            Python सीखें\n        </h2>\n        <p class="text-gray-600 text-sm mb-4">\n            शुरुआत से लेकर advanced तक, आसान भाषा में सीखें।\n        </p>\n        \n        <div class="flex justify-between items-center">\n            <span class="text-2xl font-bold text-blue-600">मुफ़्त</span>\n            <button class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">\n                शुरू करें\n            </button>\n        </div>\n    </div>\n</div>'
  },
]

// ─────────────────────────────────────────
// TAILWIND CSS LESSONS — ENGLISH
// ─────────────────────────────────────────
const tailwindLessonsEnglish = [
  {
    id: 1,
    title: "What is Tailwind CSS?",
    content: "Tailwind CSS is a utility-first CSS framework that has become extremely popular in modern web development. In traditional CSS we create our own class names like .card or .button and write their styling in a separate file. In Tailwind, instead, there are small pre-built utility classes like text-center, bg-blue-500, or p-4 that are applied directly in the HTML. Each class performs a single CSS property. This means you don't have to keep switching to a CSS file, and development becomes much faster. Tailwind was created by Adam Wathan. Large companies like GitHub, Shopify, and Netflix use Tailwind because it provides both consistency and speed.",
    example: null
  },
  {
    id: 2,
    title: "Setting Up Tailwind",
    content: "There are several ways to add Tailwind to a project. The easiest way is using a CDN link which is perfect for quick testing — you just add a script tag in the head. In production projects we install it through npm using npm install tailwindcss. Then a tailwind.config.js file is created for customization. In a main CSS file we write three directives — @tailwind base, @tailwind components, @tailwind utilities. The build process converts these into actual CSS. Modern frameworks like React, Next.js, and Vite have very smooth integration with Tailwind. It automatically includes only the classes that are actually used in the final CSS, which keeps the file size small.",
    example: '<!-- CDN for quick testing -->\n<script src="https://cdn.tailwindcss.com"></script>\n\n<!-- Then use classes directly in HTML -->\n<h1 class="text-3xl font-bold text-blue-600">\n    Hello Tailwind!\n</h1>\n\n<!-- After npm install, in CSS file -->\n@tailwind base;\n@tailwind components;\n@tailwind utilities;'
  },
  {
    id: 3,
    title: "Spacing — Padding and Margin",
    content: "Tailwind uses a numbered scale for spacing. p adds padding and m adds margin. p-4 means padding of 1rem, which is 16px, on all sides. Every number is a multiple of 0.25rem which is 4px — so p-1 is 4px, p-2 is 8px, and p-4 is 16px. For specific sides: pt is top padding, pb is bottom, pl is left, pr is right. px applies to both left and right, py applies to both top and bottom. Margin follows the same pattern with m, mt, mb, ml, mr, mx, my. Negative margins are written like -mt-4. The gap property adds spacing between flex or grid items — gap-4 gives a 16px gap. Once you learn this pattern, remembering spacing values becomes very easy.",
    example: '<div class="p-4 m-2">\n    16px padding, 8px margin\n</div>\n\n<div class="px-6 py-3">\n    Horizontal 24px, Vertical 12px\n</div>\n\n<div class="pt-8 pb-2 pl-4 pr-4">\n    Different padding for each side\n</div>\n\n<div class="flex gap-4">\n    <div>Item 1</div>\n    <div>Item 2</div>\n</div>'
  },
  {
    id: 4,
    title: "Colors and Backgrounds",
    content: "Every color in Tailwind has 10 different shades ranging from 50 to 900 — 50 is the lightest and 900 is the darkest. text-blue-500 sets the text color to a medium shade of blue. bg-red-100 gives a very light red background. bg-green-700 gives a dark green background. border-gray-300 sets the border color. Tailwind's default colors include many color families like slate, gray, red, orange, yellow, green, blue, purple, and pink. The hover: prefix lets you give a different color for the hover state, like hover:bg-blue-600. To control opacity you can write bg-blue-500/50 which gives 50% opacity. This system helps a lot in building consistent design across an entire project.",
    example: '<div class="bg-blue-500 text-white p-4">\n    Blue background, white text\n</div>\n\n<button class="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded">\n    Color changes on hover\n</button>\n\n<div class="bg-gray-100 border border-gray-300 p-4">\n    Light gray background with border\n</div>\n\n<div class="bg-purple-500/30 p-4">\n    Purple at 30% opacity\n</div>'
  },
  {
    id: 5,
    title: "Typography — Text Styling",
    content: "Tailwind has simple classes for text styling. For font size there are classes from text-xs to text-9xl — text-sm is small, text-xl is large, text-4xl is even larger. font-bold gives bold text, font-normal gives normal weight, font-light gives lighter text. text-center, text-left, text-right handle alignment. The leading- classes control line-height, like leading-tight or leading-loose. The tracking- classes control letter-spacing. underline adds an underline, line-through adds a strikethrough. truncate cuts off long text in one line with an ellipsis. The italic class slants text. All of these classes are written directly on the tag which is far faster than writing traditional CSS.",
    example: '<h1 class="text-4xl font-bold text-center">\n    Big Bold Heading\n</h1>\n\n<p class="text-sm text-gray-600 leading-relaxed">\n    This is small text with loose line height\n</p>\n\n<p class="truncate w-48">\n    This is very long text that will be cut off...\n</p>\n\n<a href="#" class="underline text-blue-600 hover:text-blue-800">\n    Link with underline\n</a>'
  },
  {
    id: 6,
    title: "Flexbox Utilities",
    content: "Flexbox becomes very easy to use in Tailwind. The flex class makes an element a flex container. flex-row is the default direction, flex-col switches to column direction. justify-center, justify-between, and justify-around handle horizontal alignment. items-center, items-start, and items-end handle vertical alignment. flex-wrap allows items to wrap. flex-1 makes an item take up the remaining space. gap-x and gap-y let you set horizontal and vertical gap separately. A very common pattern is flex justify-center items-center which perfectly centers any content — something that used to be quite tricky in traditional CSS is achieved here with just a few classes.",
    example: '<div class="flex justify-center items-center h-screen">\n    <p>This is perfectly centered</p>\n</div>\n\n<div class="flex justify-between items-center p-4">\n    <span>Left</span>\n    <span>Right</span>\n</div>\n\n<div class="flex flex-col gap-2">\n    <div>Item 1</div>\n    <div>Item 2</div>\n    <div>Item 3</div>\n</div>\n\n<div class="flex flex-wrap gap-4">\n    <div class="flex-1">Grows</div>\n    <div class="flex-1">Equal</div>\n</div>'
  },
  {
    id: 7,
    title: "Grid Utilities",
    content: "CSS Grid also comes with easy utilities in Tailwind. The grid class turns an element into a grid container. grid-cols-3 creates three equal columns — the number can range from 1 to 12. grid-rows-2 defines two rows. col-span-2 makes an item span across two columns. row-span-2 makes an item span across two rows. gap-4 adds spacing between grid items, and gap-x and gap-y control it separately. For responsive design we use prefixes like md:grid-cols-3 which only apply on medium screens and above. grid-cols-none removes the grid. Grid layouts are perfect for photo galleries, dashboards, and card layouts.",
    example: '<div class="grid grid-cols-3 gap-4">\n    <div class="bg-blue-200 p-4">1</div>\n    <div class="bg-blue-200 p-4">2</div>\n    <div class="bg-blue-200 p-4">3</div>\n</div>\n\n<div class="grid grid-cols-4 gap-2">\n    <div class="col-span-2 bg-green-200 p-4">2 columns wide</div>\n    <div class="bg-green-200 p-4">1</div>\n    <div class="bg-green-200 p-4">1</div>\n</div>\n\n<!-- Responsive grid -->\n<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\n    <div>Mobile: 1 col, Tablet: 2, Desktop: 3</div>\n</div>'
  },
  {
    id: 8,
    title: "Responsive Design Prefixes",
    content: "Tailwind's responsive system is very intuitive. Default classes apply to mobile — this is the mobile-first approach. For larger screens we use breakpoint prefixes. sm: applies at 640px and above, md: at 768px and above, lg: at 1024px and above, xl: at 1280px and above, and 2xl: at 1536px and above. For example, text-sm md:text-lg lg:text-2xl means small text on mobile, large text on tablet, and extra-large text on desktop. With this approach you can write styling for every screen size on a single HTML element without writing separate media queries. This is a very powerful feature because the entire responsive design is visible directly in the class names, with no need to open a separate CSS file.",
    example: '<div class="text-sm md:text-lg lg:text-2xl">\n    Text size changes with screen size\n</div>\n\n<div class="w-full md:w-1/2 lg:w-1/3">\n    Mobile: full width, Tablet: half, Desktop: one-third\n</div>\n\n<div class="hidden md:block">\n    Only visible on tablet and larger screens\n</div>\n\n<div class="block md:hidden">\n    Only visible on mobile\n</div>'
  },
  {
    id: 9,
    title: "Hover, Focus, and State Variants",
    content: "Tailwind has special prefixes for interactive states. hover: changes style when the mouse moves over an element, like hover:bg-blue-700. focus: changes style when an input field is focused, very useful in forms, like focus:border-blue-500 focus:outline-none. active: applies style while an element is being clicked. disabled: gives separate styling for disabled elements. For group hover effects, you add the group class on the parent and group-hover: on the child elements — this changes the child style whenever the parent is hovered. The dark: prefix lets you give different styles for dark mode. The transition and duration- classes make these state changes animate smoothly — transition-colors duration-300 smoothly changes color over 300 milliseconds.",
    example: '<button class="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 text-white px-4 py-2 rounded transition-colors duration-300">\n    Hover and click me\n</button>\n\n<input class="border border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded" placeholder="Click here">\n\n<div class="group p-4 border rounded">\n    <h3 class="group-hover:text-blue-600">Hover the parent</h3>\n    <p class="group-hover:text-blue-400">This text changes too</p>\n</div>'
  },
  {
    id: 10,
    title: "Mini Project — Responsive Card Component",
    content: "Congratulations! You have learned all the important concepts of Tailwind CSS. Now we will combine everything to build a complete responsive card component using spacing, colors, typography, flexbox, hover effects, and responsive design all together. This project shows you how real production websites are built quickly and consistently with Tailwind. This card will have an image, title, description, and a button, and it will look great on every screen size. After learning Tailwind you can build any UI very quickly because you don't need to write a traditional CSS file — everything happens through HTML classes directly.",
    example: '<div class="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 m-4">\n    <img class="w-full h-48 object-cover" src="course.jpg" alt="Course image">\n    \n    <div class="p-6">\n        <h2 class="text-xl font-bold text-gray-800 mb-2">\n            Learn Python\n        </h2>\n        <p class="text-gray-600 text-sm mb-4">\n            From beginner to advanced, in simple language.\n        </p>\n        \n        <div class="flex justify-between items-center">\n            <span class="text-2xl font-bold text-blue-600">Free</span>\n            <button class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">\n                Get Started\n            </button>\n        </div>\n    </div>\n</div>'
  },
]

// ─────────────────────────────────────────
// TAILWIND CSS LESSONS — MARATHI
// ─────────────────────────────────────────
const tailwindLessonsMarathi = [
  {
    id: 1,
    title: "Tailwind CSS म्हणजे काय?",
    content: "Tailwind CSS हे एक utility-first CSS framework आहे जे modern web development मध्ये खूप popular झाले आहे. Traditional CSS मध्ये आपण स्वतःचे class names बनवतो जसे .card किंवा .button आणि मग एका वेगळ्या file मध्ये त्यांची styling लिहतो. Tailwind मध्ये त्याऐवजी छोट्या pre-built utility classes असतात जसे text-center, bg-blue-500, किंवा p-4 ज्या थेट HTML मध्ये लावतात. प्रत्येक class एक single CSS property करते. यामुळे वारंवार CSS file मध्ये जाण्याची गरज नाही आणि development खूप fast होतो. Tailwind ला Adam Wathan यांनी बनवले होते. GitHub, Shopify, आणि Netflix सारख्या मोठ्या companies देखील Tailwind वापरतात कारण ते consistency आणि speed दोन्ही देते.",
    example: null
  },
  {
    id: 2,
    title: "Tailwind Setup करणे",
    content: "Tailwind ला project मध्ये add करण्याचे अनेक मार्ग आहेत. सर्वात सोपा मार्ग आहे CDN link वापरणे जो quick testing साठी perfect आहे — फक्त एक script tag head मध्ये add करतो. Production projects मध्ये npm द्वारे install करतो — npm install tailwindcss ने package मिळतो. मग tailwind.config.js file बनते जी customization साठी असते. एका main CSS file मध्ये तीन directives लिहतो — @tailwind base, @tailwind components, @tailwind utilities. Build process हे actual CSS मध्ये convert करते. React, Next.js, आणि Vite सारख्या modern frameworks मध्ये Tailwind चे integration खूप smooth आहे. हे आपोआप फक्त वापरलेल्या classes ला final CSS मध्ये include करते ज्यामुळे file size लहान राहते.",
    example: '<!-- Quick testing साठी CDN -->\n<script src="https://cdn.tailwindcss.com"></script>\n\n<!-- मग थेट HTML मध्ये classes वापरा -->\n<h1 class="text-3xl font-bold text-blue-600">\n    नमस्कार Tailwind!\n</h1>\n\n<!-- npm install नंतर CSS file मध्ये -->\n@tailwind base;\n@tailwind components;\n@tailwind utilities;'
  },
  {
    id: 3,
    title: "Spacing — Padding आणि Margin",
    content: "Tailwind मध्ये spacing साठी numbers based scale असतो. p ने padding लागते आणि m ने margin. p-4 म्हणजे padding सर्व बाजूंना 1rem म्हणजे 16px. प्रत्येक number 0.25rem म्हणजे 4px च्या multiples मध्ये असतो — तर p-1 आहे 4px, p-2 आहे 8px, p-4 आहे 16px. फक्त specific sides साठी: pt top padding, pb bottom, pl left, pr right. px ने left-right दोन्ही, py ने top-bottom दोन्ही. Margin साठी देखील same pattern आहे m, mt, mb, ml, mr, mx, my. Negative margin साठी -mt-4 असे लिहतात. gap property ने flex किंवा grid items च्या मधील spacing देतात — gap-4 ने 16px gap मिळतो. हा pattern शिकल्यानंतर spacing values लक्षात ठेवणे खूप सोपे होते.",
    example: '<div class="p-4 m-2">\n    Padding 16px, Margin 8px\n</div>\n\n<div class="px-6 py-3">\n    Horizontal 24px, Vertical 12px\n</div>\n\n<div class="pt-8 pb-2 pl-4 pr-4">\n    वेगवेगळ्या sides ची padding\n</div>\n\n<div class="flex gap-4">\n    <div>Item 1</div>\n    <div>Item 2</div>\n</div>'
  },
  {
    id: 4,
    title: "Colors आणि Background",
    content: "Tailwind मध्ये प्रत्येक color चे 10 वेगवेगळे shades असतात 50 ते 900 पर्यंत — 50 सर्वात हलका असतो आणि 900 सर्वात गडद. text-blue-500 ने text चा रंग blue च्या मध्यम shade मध्ये होतो. bg-red-100 ने खूप हलका लाल background मिळतो. bg-green-700 ने गडद हिरवा background मिळतो. border-gray-300 ने border चा रंग set होतो. Tailwind च्या default colors मध्ये slate, gray, red, orange, yellow, green, blue, purple, pink सारख्या खूप साऱ्या color families असतात. hover: prefix ने hover state साठी वेगळा color देता येतो जसे hover:bg-blue-600. opacity control करण्यासाठी bg-blue-500/50 लिहता येते जे 50% opacity देते. ही system consistent design बनवण्यात खूप मदत करते.",
    example: '<div class="bg-blue-500 text-white p-4">\n    Blue background, white text\n</div>\n\n<button class="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded">\n    Hover केल्यावर रंग बदलेल\n</button>\n\n<div class="bg-gray-100 border border-gray-300 p-4">\n    Light gray background with border\n</div>\n\n<div class="bg-purple-500/30 p-4">\n    30% opacity असलेला purple\n</div>'
  },
  {
    id: 5,
    title: "Typography — Text Styling",
    content: "Tailwind मध्ये text styling साठी simple classes आहेत. Font size साठी text-xs ते text-9xl पर्यंत classes आहेत — text-sm लहान आहे, text-xl मोठा आहे, text-4xl आणखी मोठा. font-bold ने bold text मिळतो, font-normal normal weight देतो, font-light हलका text देतो. text-center, text-left, text-right ने alignment होते. leading- classes line-height control करतात जसे leading-tight किंवा leading-loose. tracking- classes letter-spacing control करतात. underline ने underline लागते, line-through ने strikethrough. truncate ने लांब text एका line मध्ये ... सह cut होतो. italic class ने text तिरके होते. हे सर्व classes थेट tag मध्ये लिहतात जे traditional CSS पेक्षा खूप जास्त fast आहे.",
    example: '<h1 class="text-4xl font-bold text-center">\n    मोठी Bold Heading\n</h1>\n\n<p class="text-sm text-gray-600 leading-relaxed">\n    हे लहान text आहे loose line height सोबत\n</p>\n\n<p class="truncate w-48">\n    हे खूप लांब text आहे जे cut होईल...\n</p>\n\n<a href="#" class="underline text-blue-600 hover:text-blue-800">\n    Link with underline\n</a>'
  },
  {
    id: 6,
    title: "Flexbox Utilities",
    content: "Tailwind मध्ये flexbox खूप सहज वापरता येतो. flex class ने element flex container बनतो. flex-row default direction आहे, flex-col ने column direction मिळते. justify-center, justify-between, justify-around horizontal alignment साठी आहेत. items-center, items-start, items-end vertical alignment साठी आहेत. flex-wrap ने items wrap होऊ शकतात. flex-1 ने item बाकीची space घेतो. gap-x आणि gap-y ने horizontal आणि vertical gap वेगवेगळे set करता येतात. एक common pattern आहे flex justify-center items-center जो कोणत्याही content ला perfectly center करतो — हे traditional CSS मध्ये खूप कठीण काम होते पण Tailwind मध्ये फक्त काही classes ने होते.",
    example: '<div class="flex justify-center items-center h-screen">\n    <p>हे अगदी center मध्ये आहे</p>\n</div>\n\n<div class="flex justify-between items-center p-4">\n    <span>डावीकडे</span>\n    <span>उजवीकडे</span>\n</div>\n\n<div class="flex flex-col gap-2">\n    <div>Item 1</div>\n    <div>Item 2</div>\n    <div>Item 3</div>\n</div>\n\n<div class="flex flex-wrap gap-4">\n    <div class="flex-1">Grows</div>\n    <div class="flex-1">Equal</div>\n</div>'
  },
  {
    id: 7,
    title: "Grid Utilities",
    content: "Tailwind मध्ये CSS Grid देखील सोप्या utilities सोबत मिळतो. grid class ने element grid container बनतो. grid-cols-3 ने तीन equal columns बनतात — number 1 ते 12 पर्यंत असू शकतो. grid-rows-2 ने दोन rows define होतात. col-span-2 ने एखादा item दोन columns मध्ये पसरतो. row-span-2 ने item दोन rows मध्ये पसरतो. gap-4 ने grid items च्या मधील spacing मिळते, gap-x आणि gap-y वेगळे control होतात. Responsive design साठी md:grid-cols-3 सारखे prefixes वापरतात जे फक्त medium screens आणि मोठ्यावर apply होतात. grid-cols-none ने grid हटवता येते. Grid layouts photo galleries, dashboards, आणि card layouts साठी perfect आहेत.",
    example: '<div class="grid grid-cols-3 gap-4">\n    <div class="bg-blue-200 p-4">1</div>\n    <div class="bg-blue-200 p-4">2</div>\n    <div class="bg-blue-200 p-4">3</div>\n</div>\n\n<div class="grid grid-cols-4 gap-2">\n    <div class="col-span-2 bg-green-200 p-4">2 columns wide</div>\n    <div class="bg-green-200 p-4">1</div>\n    <div class="bg-green-200 p-4">1</div>\n</div>\n\n<!-- Responsive grid -->\n<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\n    <div>Mobile: 1 col, Tablet: 2, Desktop: 3</div>\n</div>'
  },
  {
    id: 8,
    title: "Responsive Design Prefixes",
    content: "Tailwind ची responsive system खूप intuitive आहे. Default classes mobile साठी असतात — ही mobile-first approach आहे. मोठ्या screens साठी breakpoint prefixes वापरतात. sm: 640px आणि मोठ्या screens साठी, md: 768px आणि मोठ्यासाठी, lg: 1024px आणि मोठ्यासाठी, xl: 1280px आणि मोठ्यासाठी, 2xl: 1536px आणि मोठ्यासाठी. जसे text-sm md:text-lg lg:text-2xl म्हणजे mobile वर small text, tablet वर large text, desktop वर extra-large text. या approach ने एकाच HTML element मध्ये सर्व screen sizes साठी styling लिहता येते वेगळ्या media queries न लिहता. हे खूप powerful feature आहे कारण संपूर्ण responsive design थेट class names मध्ये दिसते, वेगळी CSS file उघडण्याची गरज नाही.",
    example: '<div class="text-sm md:text-lg lg:text-2xl">\n    Screen size नुसार text size बदलतो\n</div>\n\n<div class="w-full md:w-1/2 lg:w-1/3">\n    Mobile: full width, Tablet: half, Desktop: एक तृतीयांश\n</div>\n\n<div class="hidden md:block">\n    फक्त tablet आणि मोठ्या screens वर दिसेल\n</div>\n\n<div class="block md:hidden">\n    फक्त mobile वर दिसेल\n</div>'
  },
  {
    id: 9,
    title: "Hover, Focus आणि State Variants",
    content: "Tailwind मध्ये interactive states साठी special prefixes असतात. hover: ने mouse आल्यावर style बदलते — hover:bg-blue-700. focus: ने input field वर focus आल्यावर style बदलते, forms मध्ये खूप useful आहे — focus:border-blue-500 focus:outline-none. active: ने click होताना style मिळते. disabled: ने disabled elements साठी वेगळी styling असते. group hover साठी group class parent वर लावतात आणि group-hover: child elements वर — यामुळे parent hover केल्यावर child देखील style बदलतो. dark: prefix ने dark mode साठी वेगळे styles देता येतात. transition आणि duration- classes ने हे state changes smooth animate होतात — transition-colors duration-300 ने रंग 300 milliseconds मध्ये smoothly बदलतो.",
    example: '<button class="bg-blue-500 hover:bg-blue-700 active:bg-blue-900 text-white px-4 py-2 rounded transition-colors duration-300">\n    Hover आणि click करा\n</button>\n\n<input class="border border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded" placeholder="इथे click करा">\n\n<div class="group p-4 border rounded">\n    <h3 class="group-hover:text-blue-600">Parent वर hover करा</h3>\n    <p class="group-hover:text-blue-400">हा text देखील बदलेल</p>\n</div>'
  },
  {
    id: 10,
    title: "Mini Project — Responsive Card Component",
    content: "शाब्बास! तुम्ही Tailwind CSS चे सर्व महत्त्वाचे concepts शिकलात. आता आपण सर्व एकत्र करून एक complete responsive card component बनवूया ज्यात spacing, colors, typography, flexbox, hover effects, आणि responsive design — सर्व वापरले जाईल. हे project दाखवेल की real production websites Tailwind ने कशा fast आणि consistent पद्धतीने बनतात. या card मध्ये image, title, description, आणि button असेल जो सर्व screen sizes वर चांगला दिसेल. Tailwind शिकल्यानंतर तुम्ही कोणताही UI खूप वेगाने बनवू शकता कारण traditional CSS file लिहण्याची गरज नाही — सर्व काही HTML classes मध्येच होते.",
    example: '<div class="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 m-4">\n    <img class="w-full h-48 object-cover" src="course.jpg" alt="Course image">\n    \n    <div class="p-6">\n        <h2 class="text-xl font-bold text-gray-800 mb-2">\n            Python शिका\n        </h2>\n        <p class="text-gray-600 text-sm mb-4">\n            सुरुवातीपासून advanced पर्यंत, सोप्या भाषेत शिका.\n        </p>\n        \n        <div class="flex justify-between items-center">\n            <span class="text-2xl font-bold text-blue-600">मोफत</span>\n            <button class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">\n                सुरू करा\n            </button>\n        </div>\n    </div>\n</div>'
  },
]

// ─────────────────────────────────────────
// TYPESCRIPT LESSONS — HINDI (paste after tailwindLessonsMarathi)
// ─────────────────────────────────────────
const typescriptLessons = [
  {
    id: 1,
    title: "TypeScript क्या है?",
    content: "TypeScript JavaScript का एक superset है जिसे Microsoft ने 2012 में बनाया था। Superset का मतलब है कि TypeScript में JavaScript का सारा code valid रहता है, और इसके ऊपर TypeScript कुछ extra features add करता है — सबसे बड़ा है static typing। JavaScript dynamically typed है यानी variable का type कभी भी बदल सकता है और errors सिर्फ runtime पर पता चलती हैं। TypeScript में हम variables, functions, और objects के types पहले से बता सकते हैं, और अगर कहीं गलत type use हो तो editor में लिखते समय ही error दिख जाती है — runtime तक wait नहीं करना पड़ता। बड़ी companies जैसे Microsoft, Google, Airbnb, और Slack TypeScript use करती हैं क्योंकि यह बड़े projects में bugs कम करने में बहुत मदद करता है। TypeScript code को compile करके वापस JavaScript में convert किया जाता है क्योंकि browsers सीधे TypeScript नहीं समझते।",
    example: null
  },
  {
    id: 2,
    title: "Basic Types",
    content: "TypeScript में variables के साथ उनका type colon लगाकर लिखते हैं। string type text के लिए होता है। number type सभी संख्याओं के लिए होता है — पूरी और दशमलव दोनों, JavaScript की तरह यहाँ int और float अलग नहीं होते। boolean type true या false के लिए होता है। Array का type दो तरीकों से लिख सकते हैं — number[] या Array<number>। any type किसी भी प्रकार की value रख सकता है लेकिन इसे जितना कम use करें उतना अच्छा क्योंकि यह TypeScript के फायदे को कम कर देता है। void type उन functions के लिए होता है जो कुछ return नहीं करते। TypeScript बहुत बार type को automatically detect भी कर लेता है, इसे type inference कहते हैं — फिर भी explicit type लिखना अच्छी practice है।",
    example: 'let naam: string = "Sharada";\nlet umar: number = 20;\nlet isStudent: boolean = true;\nlet marks: number[] = [85, 90, 78];\nlet anything: any = "कुछ भी हो सकता है";\n\nfunction greet(): void {\n    console.log("नमस्ते " + naam);\n}\n\nconsole.log(naam, umar, isStudent);\nconsole.log(marks);\ngreet();'
  },
  {
    id: 3,
    title: "Functions में Types",
    content: "TypeScript में functions के parameters और return value दोनों के types बता सकते हैं। Parameter के बाद colon लगाकर type लिखते हैं। Function के closing bracket के बाद colon लगाकर return type लिखते हैं। अगर return type number है तो function जरूर एक number ही return करेगा, नहीं तो error आएगी। Optional parameters के लिए parameter name के बाद question mark लगाते हैं — यह बताता है कि function call करते समय यह parameter देना जरूरी नहीं। Default parameters में equal sign से default value दे सकते हैं। Arrow functions में भी same तरीके से types लिखते हैं। यह सब features मिलकर ensure करते हैं कि function सही तरीके से call हो रहा है, गलत arguments पास होने पर editor तुरंत बता देता है।",
    example: 'function add(a: number, b: number): number {\n    return a + b;\n}\n\nfunction greet(naam: string, message?: string): string {\n    return message ? message + " " + naam : "नमस्ते " + naam;\n}\n\nfunction multiply(a: number, b: number = 2): number {\n    return a * b;\n}\n\nconst subtract = (a: number, b: number): number => a - b;\n\nconsole.log(add(5, 3));\nconsole.log(greet("Sharada"));\nconsole.log(greet("Pyra", "नमस्कार"));\nconsole.log(multiply(5));\nconsole.log(subtract(10, 4));'
  },
  {
    id: 4,
    title: "Interfaces — Object Shapes Define करना",
    content: "Interface से हम बताते हैं कि किसी object की shape कैसी होनी चाहिए — कौन-कौन से properties होने चाहिए और उनके types क्या होने चाहिए। interface keyword से interface बनाते हैं। हर property का नाम और type colon से अलग करते हैं। Optional properties के लिए नाम के बाद question mark लगाते हैं। readonly keyword से property को सिर्फ एक बार set कर सकते हैं, बाद में बदल नहीं सकते। जब किसी variable को उस interface का type देते हैं, तो TypeScript check करता है कि object exactly उस shape का है या नहीं — अगर कोई जरूरी property missing है या गलत type की है तो error आती है। Interfaces बड़े projects में बहुत जरूरी हैं क्योंकि वे data की structure को consistent रखते हैं और team के सभी members को पता रहता है कि object में क्या-क्या होना चाहिए।",
    example: 'interface Student {\n    naam: string;\n    umar: number;\n    marks: number;\n    isActive?: boolean;\n    readonly id: number;\n}\n\nconst student1: Student = {\n    naam: "Sharada",\n    umar: 20,\n    marks: 92.5,\n    id: 1\n};\n\nfunction displayStudent(s: Student): void {\n    console.log(s.naam + " - " + s.umar + " साल - " + s.marks + " marks");\n}\n\ndisplayStudent(student1);\n\n// student1.id = 2;  // Error! readonly property बदल नहीं सकते'
  },
  {
    id: 5,
    title: "Type Aliases और Union Types",
    content: "Type alias से हम किसी type को एक नया नाम दे सकते हैं जिसे बार-बार use कर सकते हैं। type keyword से type alias बनाते हैं। Union types से किसी variable को कई possible types में से एक होने देते हैं — pipe symbol से types को जोड़ते हैं। जैसे एक variable string या number दोनों हो सकता है। Union types खासकर तब useful हैं जब function अलग-अलग types accept कर सकता है। Literal types से हम specific values को ही allow करते हैं, जैसे सिर्फ 'small', 'medium', या 'large' string values। यह बहुत useful है जब हमें pता हो कि variable सिर्फ कुछ fixed values ही ले सकता है — जैसे status field जो सिर्फ 'pending', 'completed', या 'cancelled' हो सकता है। Type aliases code को readable और reusable बनाते हैं।",
    example: 'type ID = string | number;\n\ntype Status = "pending" | "completed" | "cancelled";\n\nfunction printID(id: ID): void {\n    console.log("ID है: " + id);\n}\n\nfunction updateStatus(status: Status): void {\n    console.log("Status: " + status);\n}\n\nprintID(101);\nprintID("STU-101");\nupdateStatus("completed");\n\n// updateStatus("done");  // Error! "done" valid status नहीं है'
  },
  {
    id: 6,
    title: "Classes में Types",
    content: "TypeScript classes में हर field का type बताना जरूरी है। access modifiers — public, private, protected — TypeScript में strictly enforce होते हैं, जो JavaScript में नहीं था। private field को class के बाहर access करने पर compile-time error आती है, जो data को secure बनाता है। Constructor के parameters में भी types देते हैं। TypeScript में एक shorthand है जहाँ constructor के parameters में directly public/private लिखकर field declaration भी automatically हो जाती है। Interfaces को classes के साथ implement keyword से use कर सकते हैं, जिससे class को उस interface के सभी properties और methods provide करने होंगे। Inheritance वैसे ही काम करती है जैसे JavaScript में extends keyword से, लेकिन types के साथ अतिरिक्त safety मिलती है।",
    example: 'class Student {\n    private naam: string;\n    public umar: number;\n    \n    constructor(naam: string, umar: number) {\n        this.naam = naam;\n        this.umar = umar;\n    }\n    \n    public displayInfo(): void {\n        console.log(this.naam + " - " + this.umar + " साल");\n    }\n}\n\n// Shorthand constructor\nclass Teacher {\n    constructor(public naam: string, private subject: string) {}\n    \n    getSubject(): string {\n        return this.subject;\n    }\n}\n\nconst s1 = new Student("Sharada", 20);\ns1.displayInfo();\n\nconst t1 = new Teacher("Priya", "Mathematics");\nconsole.log(t1.naam, t1.getSubject());'
  },
  {
    id: 7,
    title: "Generics — Reusable Type-Safe Code",
    content: "Generics से हम ऐसे functions और classes बना सकते हैं जो किसी भी type के साथ काम करें, लेकिन फिर भी type safety बनी रहे। Angular brackets <T> में एक placeholder type लिखते हैं जिसे actual use करते समय असली type से replace किया जाता है। यह बिल्कुल function parameters की तरह काम करता है, बस values की जगह types के लिए। Generic function किसी भी type को accept कर सकता है और वही type return करता है, जिससे flexibility और type safety दोनों मिलती है। Generic interfaces और classes भी बना सकते हैं — जैसे एक Box class जो किसी भी type की value रख सके। Multiple generic types भी एक साथ use कर सकते हैं जैसे <T, U>। Generics TypeScript की सबसे powerful features में से एक हैं क्योंकि वे code reuse करने देते हैं बिना type safety खोए।",
    example: 'function identity<T>(value: T): T {\n    return value;\n}\n\ninterface Box<T> {\n    content: T;\n}\n\nfunction getFirstItem<T>(items: T[]): T {\n    return items[0];\n}\n\nconst numBox: Box<number> = { content: 42 };\nconst strBox: Box<string> = { content: "नमस्ते" };\n\nconsole.log(identity<string>("Sharada"));\nconsole.log(identity<number>(25));\n\nconst fruits: string[] = ["apple", "banana", "mango"];\nconsole.log(getFirstItem(fruits));\n\nconsole.log(numBox.content);\nconsole.log(strBox.content);'
  },
  {
    id: 8,
    title: "Enums — Named Constants",
    content: "Enum यानी enumeration से हम related constants का एक set define कर सकते हैं जिनके readable नाम होते हैं। enum keyword से enum बनाते हैं। Default रूप से enum members को 0 से शुरू होने वाली numbers मिलती हैं, और हर अगला member पिछले से एक ज्यादा होता है। हम चाहें तो खुद specific numbers assign कर सकते हैं। String enums में हर member को एक specific string value देते हैं जो ज्यादा readable होती है debugging के time। Enums खासकर तब useful हैं जब हमें pता हो कि variable सिर्फ कुछ specific predefined values ही ले सकता है, जैसे days of week, directions, या status types। Enum use करने से magic numbers या strings की जगह meaningful names मिलते हैं जिससे code पढ़ना आसान होता है।",
    example: 'enum Status {\n    Pending,\n    InProgress,\n    Completed,\n    Cancelled\n}\n\nenum Direction {\n    Up = "UP",\n    Down = "DOWN",\n    Left = "LEFT",\n    Right = "RIGHT"\n}\n\nfunction updateOrder(status: Status): void {\n    if (status === Status.Completed) {\n        console.log("Order पूरा हो गया!");\n    } else if (status === Status.Pending) {\n        console.log("Order pending है");\n    }\n}\n\nupdateOrder(Status.Completed);\nconsole.log(Direction.Up);\nconsole.log(Status.InProgress);  // 1 print होगा'
  },
  {
    id: 9,
    title: "TypeScript को Setup करना और Compile करना",
    content: "TypeScript use करने के लिए सबसे पहले npm install -g typescript से global install करते हैं। tsc compiler command है जो TypeScript file को JavaScript में convert करती है। एक .ts extension वाली file बनाते हैं जिसमें TypeScript code लिखते हैं। tsc filename.ts चलाने से वही नाम की .js file बन जाती है। tsconfig.json file project की settings रखती है जैसे target JavaScript version, strict mode on/off, और किन folders को compile करना है। strict: true सबसे recommended setting है क्योंकि यह सभी strict type checking features को enable कर देती है। Modern projects में अक्सर ts-node use करते हैं जो बिना पहले compile किए directly TypeScript run कर देता है development के दौरान। Build tools जैसे Webpack और Vite में भी TypeScript का built-in support होता है।",
    example: '// terminal commands:\n// npm install -g typescript\n// tsc --init   (tsconfig.json बनाने के लिए)\n// tsc app.ts   (compile करने के लिए)\n// node app.js  (run करने के लिए)\n\n// tsconfig.json उदाहरण:\n// {\n//   "compilerOptions": {\n//     "target": "ES2020",\n//     "strict": true,\n//     "outDir": "./dist"\n//   }\n// }\n\n// app.ts\nfunction greet(naam: string): string {\n    return "नमस्ते " + naam + "!";\n}\n\nconsole.log(greet("Sharada"));'
  },
  {
    id: 10,
    title: "Mini Project — Type-Safe Todo List",
    content: "शाबाश! आपने TypeScript के सभी important concepts सीख लिए। अब हम सब कुछ मिलाकर एक Type-Safe Todo List Manager बनाएंगे। इस project में हम interfaces, enums, generics, classes, और functions सब use करेंगे। यह project दिखाएगा कि कैसे TypeScript real applications में bugs को पहले ही पकड़ लेता है, runtime तक wait नहीं करना पड़ता। हम एक Todo interface बनाएंगे जिसमें properties होंगी, एक Priority enum होगा, और एक TodoManager class होगी जो todos को add, complete, और display करेगी। यह project आपको दिखाएगा कि TypeScript professional applications में development को कितना safer और faster बना देता है।",
    example: 'interface Todo {\n    id: number;\n    title: string;\n    priority: Priority;\n    completed: boolean;\n}\n\nenum Priority {\n    Low = "कम",\n    Medium = "मध्यम",\n    High = "ज्यादा"\n}\n\nclass TodoManager {\n    private todos: Todo[] = [];\n    private nextId: number = 1;\n    \n    addTodo(title: string, priority: Priority): void {\n        const newTodo: Todo = {\n            id: this.nextId++,\n            title: title,\n            priority: priority,\n            completed: false\n        };\n        this.todos.push(newTodo);\n        console.log(title + " add हो गया!");\n    }\n    \n    completeTodo(id: number): void {\n        const todo = this.todos.find(t => t.id === id);\n        if (todo) {\n            todo.completed = true;\n            console.log(todo.title + " complete हो गया!");\n        }\n    }\n    \n    displayAll(): void {\n        console.log("=== सभी Todos ===");\n        this.todos.forEach(t => {\n            const status = t.completed ? "✓" : "○";\n            console.log(status + " " + t.title + " [" + t.priority + "]");\n        });\n    }\n}\n\nconst manager = new TodoManager();\nmanager.addTodo("Python सीखें", Priority.High);\nmanager.addTodo("Groceries खरीदें", Priority.Low);\nmanager.completeTodo(1);\nmanager.displayAll();'
  },
]

// ─────────────────────────────────────────
// TYPESCRIPT LESSONS — ENGLISH
// ─────────────────────────────────────────
const typescriptLessonsEnglish = [
  {
    id: 1,
    title: "What is TypeScript?",
    content: "TypeScript is a superset of JavaScript created by Microsoft in 2012. Superset means that all valid JavaScript code is also valid TypeScript code, and on top of that TypeScript adds extra features, the biggest being static typing. JavaScript is dynamically typed which means a variable's type can change at any time and errors are only discovered at runtime. In TypeScript we can declare the types of variables, functions, and objects in advance, and if the wrong type is used anywhere the error shows up right in the editor while writing the code, without waiting until runtime. Large companies like Microsoft, Google, Airbnb, and Slack use TypeScript because it greatly reduces bugs in large projects. TypeScript code is compiled back into JavaScript because browsers do not understand TypeScript directly.",
    example: null
  },
  {
    id: 2,
    title: "Basic Types",
    content: "In TypeScript we write a variable's type after a colon. The string type is for text. The number type is for all numbers, both whole and decimal — unlike some languages, TypeScript does not separate int and float. The boolean type is for true or false. An array type can be written two ways — number[] or Array of number. The any type can hold a value of any kind, but it should be used as little as possible since it removes the benefits that TypeScript provides. The void type is for functions that return nothing. TypeScript can often detect the type automatically, which is called type inference, but writing explicit types is still good practice.",
    example: 'let name: string = "Sharada";\nlet age: number = 20;\nlet isStudent: boolean = true;\nlet marks: number[] = [85, 90, 78];\nlet anything: any = "could be anything";\n\nfunction greet(): void {\n    console.log("Hello " + name);\n}\n\nconsole.log(name, age, isStudent);\nconsole.log(marks);\ngreet();'
  },
  {
    id: 3,
    title: "Types in Functions",
    content: "In TypeScript we can declare types for both the parameters and the return value of a function. We write the type after a colon following each parameter. We write the return type after a colon following the closing parenthesis of the function. If the return type is number then the function must return a number, otherwise an error is raised. For optional parameters we add a question mark after the parameter name, which means the function does not require that argument when called. Default parameters can be given a default value using an equals sign. Arrow functions use the same way of declaring types. All of these features together ensure the function is being called correctly, and the editor immediately flags any wrong arguments being passed.",
    example: 'function add(a: number, b: number): number {\n    return a + b;\n}\n\nfunction greet(name: string, message?: string): string {\n    return message ? message + " " + name : "Hello " + name;\n}\n\nfunction multiply(a: number, b: number = 2): number {\n    return a * b;\n}\n\nconst subtract = (a: number, b: number): number => a - b;\n\nconsole.log(add(5, 3));\nconsole.log(greet("Sharada"));\nconsole.log(greet("Pyra", "Hi"));\nconsole.log(multiply(5));\nconsole.log(subtract(10, 4));'
  },
  {
    id: 4,
    title: "Interfaces — Defining Object Shapes",
    content: "An interface describes what shape an object should have — what properties it must have and what type each one is. We use the interface keyword to create one. Each property's name and type are separated by a colon. For optional properties we add a question mark after the name. The readonly keyword means a property can only be set once and cannot be changed afterward. When we give a variable that interface as its type, TypeScript checks that the object exactly matches that shape — if a required property is missing or has the wrong type, an error appears. Interfaces are essential in large projects because they keep data structures consistent and make sure every team member knows exactly what an object should contain.",
    example: 'interface Student {\n    name: string;\n    age: number;\n    marks: number;\n    isActive?: boolean;\n    readonly id: number;\n}\n\nconst student1: Student = {\n    name: "Sharada",\n    age: 20,\n    marks: 92.5,\n    id: 1\n};\n\nfunction displayStudent(s: Student): void {\n    console.log(s.name + " - age " + s.age + " - " + s.marks + " marks");\n}\n\ndisplayStudent(student1);\n\n// student1.id = 2;  // Error! cannot change a readonly property'
  },
  {
    id: 5,
    title: "Type Aliases and Union Types",
    content: "A type alias lets us give a type a new name that we can reuse. We use the type keyword to create one. Union types let a variable be one of several possible types — the pipe symbol joins the types together. For example a variable could be either a string or a number. Union types are especially useful when a function can accept several different types. Literal types let us allow only specific values, such as only the strings 'small', 'medium', or 'large'. This is very useful when we know a variable should only ever hold a fixed set of values, like a status field that can only be 'pending', 'completed', or 'cancelled'. Type aliases make code more readable and reusable.",
    example: 'type ID = string | number;\n\ntype Status = "pending" | "completed" | "cancelled";\n\nfunction printID(id: ID): void {\n    console.log("ID is: " + id);\n}\n\nfunction updateStatus(status: Status): void {\n    console.log("Status: " + status);\n}\n\nprintID(101);\nprintID("STU-101");\nupdateStatus("completed");\n\n// updateStatus("done");  // Error! "done" is not a valid status'
  },
  {
    id: 6,
    title: "Types in Classes",
    content: "In TypeScript classes you must declare the type of every field. Access modifiers — public, private, protected — are strictly enforced in TypeScript, unlike in plain JavaScript. Trying to access a private field from outside the class produces a compile-time error, which keeps data secure. Constructor parameters can also have types. TypeScript has a shorthand where writing public or private directly in the constructor parameters automatically declares the field too. Classes can implement an interface using the implements keyword, which requires the class to provide every property and method defined in that interface. Inheritance works the same way as in JavaScript using the extends keyword, but with the added safety that types provide.",
    example: 'class Student {\n    private name: string;\n    public age: number;\n    \n    constructor(name: string, age: number) {\n        this.name = name;\n        this.age = age;\n    }\n    \n    public displayInfo(): void {\n        console.log(this.name + " - age " + this.age);\n    }\n}\n\n// Shorthand constructor\nclass Teacher {\n    constructor(public name: string, private subject: string) {}\n    \n    getSubject(): string {\n        return this.subject;\n    }\n}\n\nconst s1 = new Student("Sharada", 20);\ns1.displayInfo();\n\nconst t1 = new Teacher("Priya", "Mathematics");\nconsole.log(t1.name, t1.getSubject());'
  },
  {
    id: 7,
    title: "Generics — Reusable Type-Safe Code",
    content: "Generics let us write functions and classes that work with any type while still keeping type safety. We write a placeholder type inside angle brackets, like T, which gets replaced with the actual type when used. This works exactly like a function parameter, but for types instead of values. A generic function can accept any type and return that same type, giving us both flexibility and type safety at once. We can also create generic interfaces and classes, such as a Box class that can hold a value of any type. Multiple generic types can be used together, like T and U. Generics are one of the most powerful features of TypeScript because they let us reuse code without losing type safety.",
    example: 'function identity<T>(value: T): T {\n    return value;\n}\n\ninterface Box<T> {\n    content: T;\n}\n\nfunction getFirstItem<T>(items: T[]): T {\n    return items[0];\n}\n\nconst numBox: Box<number> = { content: 42 };\nconst strBox: Box<string> = { content: "Hello" };\n\nconsole.log(identity<string>("Sharada"));\nconsole.log(identity<number>(25));\n\nconst fruits: string[] = ["apple", "banana", "mango"];\nconsole.log(getFirstItem(fruits));\n\nconsole.log(numBox.content);\nconsole.log(strBox.content);'
  },
  {
    id: 8,
    title: "Enums — Named Constants",
    content: "An enum, short for enumeration, lets us define a set of related constants with readable names. We use the enum keyword to create one. By default, enum members are assigned numbers starting from 0, and each next member increases by one. We can also assign specific numbers ourselves. String enums give each member a specific string value, which is much more readable while debugging. Enums are especially useful when we know a variable should only ever hold one of a few predefined values, like days of the week, directions, or status types. Using enums replaces magic numbers or strings with meaningful names, making the code much easier to read.",
    example: 'enum Status {\n    Pending,\n    InProgress,\n    Completed,\n    Cancelled\n}\n\nenum Direction {\n    Up = "UP",\n    Down = "DOWN",\n    Left = "LEFT",\n    Right = "RIGHT"\n}\n\nfunction updateOrder(status: Status): void {\n    if (status === Status.Completed) {\n        console.log("Order is complete!");\n    } else if (status === Status.Pending) {\n        console.log("Order is pending");\n    }\n}\n\nupdateOrder(Status.Completed);\nconsole.log(Direction.Up);\nconsole.log(Status.InProgress);  // prints 1'
  },
  {
    id: 9,
    title: "Setting Up and Compiling TypeScript",
    content: "To use TypeScript, first install it globally using npm install -g typescript. The tsc command is the compiler that converts a TypeScript file into JavaScript. You create a file with a .ts extension and write TypeScript code in it. Running tsc filename.ts produces a .js file with the same name. A tsconfig.json file holds project settings such as the target JavaScript version, whether strict mode is on or off, and which folders to compile. Setting strict to true is the most recommended setting because it enables all of TypeScript's strict type-checking features. Modern projects often use ts-node, which runs TypeScript directly without compiling it first, which is great during development. Build tools like Webpack and Vite also have built-in support for TypeScript.",
    example: '// terminal commands:\n// npm install -g typescript\n// tsc --init   (creates tsconfig.json)\n// tsc app.ts   (compiles the file)\n// node app.js  (runs the file)\n\n// example tsconfig.json:\n// {\n//   "compilerOptions": {\n//     "target": "ES2020",\n//     "strict": true,\n//     "outDir": "./dist"\n//   }\n// }\n\n// app.ts\nfunction greet(name: string): string {\n    return "Hello " + name + "!";\n}\n\nconsole.log(greet("Sharada"));'
  },
  {
    id: 10,
    title: "Mini Project — Type-Safe Todo List",
    content: "Congratulations! You have learned all the important concepts of TypeScript. Now we will combine everything to build a Type-Safe Todo List Manager. This project uses interfaces, enums, generics, classes, and functions all together. It shows how TypeScript catches bugs in real applications early, without having to wait until runtime. We will build a Todo interface with several properties, a Priority enum, and a TodoManager class that adds, completes, and displays todos. This project shows you how much safer and faster TypeScript makes development in professional applications.",
    example: 'interface Todo {\n    id: number;\n    title: string;\n    priority: Priority;\n    completed: boolean;\n}\n\nenum Priority {\n    Low = "Low",\n    Medium = "Medium",\n    High = "High"\n}\n\nclass TodoManager {\n    private todos: Todo[] = [];\n    private nextId: number = 1;\n    \n    addTodo(title: string, priority: Priority): void {\n        const newTodo: Todo = {\n            id: this.nextId++,\n            title: title,\n            priority: priority,\n            completed: false\n        };\n        this.todos.push(newTodo);\n        console.log(title + " added!");\n    }\n    \n    completeTodo(id: number): void {\n        const todo = this.todos.find(t => t.id === id);\n        if (todo) {\n            todo.completed = true;\n            console.log(todo.title + " completed!");\n        }\n    }\n    \n    displayAll(): void {\n        console.log("=== All Todos ===");\n        this.todos.forEach(t => {\n            const status = t.completed ? "✓" : "○";\n            console.log(status + " " + t.title + " [" + t.priority + "]");\n        });\n    }\n}\n\nconst manager = new TodoManager();\nmanager.addTodo("Learn Python", Priority.High);\nmanager.addTodo("Buy groceries", Priority.Low);\nmanager.completeTodo(1);\nmanager.displayAll();'
  },
]

// ─────────────────────────────────────────
// TYPESCRIPT LESSONS — MARATHI
// ─────────────────────────────────────────
const typescriptLessonsMarathi = [
  {
    id: 1,
    title: "TypeScript म्हणजे काय?",
    content: "TypeScript हे JavaScript चे एक superset आहे जे Microsoft ने 2012 साली बनवले. Superset म्हणजे TypeScript मध्ये JavaScript चा सर्व code valid राहतो, आणि त्याच्या वर TypeScript काही extra features add करते — सर्वात मोठे आहे static typing. JavaScript dynamically typed आहे म्हणजे variable चा type कधीही बदलू शकतो आणि errors फक्त runtime वर कळतात. TypeScript मध्ये आपण variables, functions, आणि objects चे types आधीच सांगू शकतो, आणि जर कुठे चुकीचा type वापरला तर editor मध्ये लिहताना लगेच error दिसते — runtime पर्यंत wait करावे लागत नाही. Microsoft, Google, Airbnb, आणि Slack सारख्या मोठ्या companies TypeScript वापरतात कारण हे मोठ्या projects मध्ये bugs कमी करण्यात खूप मदत करते. TypeScript code compile करून परत JavaScript मध्ये convert केला जातो कारण browsers थेट TypeScript समजत नाहीत.",
    example: null
  },
  {
    id: 2,
    title: "Basic Types",
    content: "TypeScript मध्ये variables सोबत त्यांचा type colon लावून लिहतात. string type text साठी असतो. number type सर्व संख्यांसाठी असतो — पूर्ण आणि दशांश दोन्ही, JavaScript प्रमाणे इथे int आणि float वेगळे नसतात. boolean type true किंवा false साठी असतो. Array चा type दोन प्रकारे लिहता येतो — number[] किंवा Array<number>. any type कोणत्याही प्रकारची value ठेवू शकतो पण हे जितके कमी वापराल तितके चांगले कारण हे TypeScript चा फायदा कमी करते. void type त्या functions साठी असतो जे काही return करत नाहीत. TypeScript बऱ्याच वेळा type आपोआप detect देखील करतो, याला type inference म्हणतात — तरीही explicit type लिहणे चांगली practice आहे.",
    example: 'let naam: string = "Sharada";\nlet vay: number = 20;\nlet isStudent: boolean = true;\nlet marks: number[] = [85, 90, 78];\nlet anything: any = "काहीही असू शकते";\n\nfunction namaskaar(): void {\n    console.log("नमस्कार " + naam);\n}\n\nconsole.log(naam, vay, isStudent);\nconsole.log(marks);\nnamaskaar();'
  },
  {
    id: 3,
    title: "Functions मध्ये Types",
    content: "TypeScript मध्ये functions च्या parameters आणि return value दोन्हीचे types सांगता येतात. Parameter च्या नंतर colon लावून type लिहतात. Function च्या closing bracket च्या नंतर colon लावून return type लिहतात. जर return type number असेल तर function नक्की एक number च return करेल, नाहीतर error येते. Optional parameters साठी parameter name नंतर question mark लावतात — हे सांगते की function call करताना हा parameter देणे आवश्यक नाही. Default parameters मध्ये equal sign ने default value देता येते. Arrow functions मध्ये देखील same पद्धतीने types लिहतात. हे सर्व features मिळून ensure करतात की function योग्य पद्धतीने call होत आहे, चुकीचे arguments pass केल्यास editor लगेच सांगतो.",
    example: 'function add(a: number, b: number): number {\n    return a + b;\n}\n\nfunction namaskaar(naam: string, message?: string): string {\n    return message ? message + " " + naam : "नमस्कार " + naam;\n}\n\nfunction multiply(a: number, b: number = 2): number {\n    return a * b;\n}\n\nconst subtract = (a: number, b: number): number => a - b;\n\nconsole.log(add(5, 3));\nconsole.log(namaskaar("Sharada"));\nconsole.log(namaskaar("Pyra", "नमस्ते"));\nconsole.log(multiply(5));\nconsole.log(subtract(10, 4));'
  },
  {
    id: 4,
    title: "Interfaces — Object Shapes Define करणे",
    content: "Interface ने आपण सांगतो की एखाद्या object ची shape कशी असायला हवी — कोणकोणत्या properties असायला हव्यात आणि त्यांचे types काय असायला हवेत. interface keyword ने interface बनवतो. प्रत्येक property चे नाव आणि type colon ने वेगळे करतात. Optional properties साठी नावानंतर question mark लावतात. readonly keyword ने property फक्त एकदाच set करता येतो, नंतर बदलता येत नाही. जेव्हा एखाद्या variable ला त्या interface चा type देतो, तेव्हा TypeScript check करतो की object exactly त्या shape चा आहे की नाही — जर कोणती आवश्यक property missing असेल किंवा चुकीच्या type ची असेल तर error येते. Interfaces मोठ्या projects मध्ये खूप आवश्यक आहेत कारण ते data ची structure consistent ठेवतात आणि team च्या सर्व members ना कळते की object मध्ये काय काय असायला हवे.",
    example: 'interface Student {\n    naam: string;\n    vay: number;\n    marks: number;\n    isActive?: boolean;\n    readonly id: number;\n}\n\nconst student1: Student = {\n    naam: "Sharada",\n    vay: 20,\n    marks: 92.5,\n    id: 1\n};\n\nfunction displayStudent(s: Student): void {\n    console.log(s.naam + " - " + s.vay + " वर्षे - " + s.marks + " marks");\n}\n\ndisplayStudent(student1);\n\n// student1.id = 2;  // Error! readonly property बदलता येत नाही'
  },
  {
    id: 5,
    title: "Type Aliases आणि Union Types",
    content: "Type alias ने आपण एखाद्या type ला नवीन नाव देऊ शकतो जे वारंवार वापरता येते. type keyword ने type alias बनवतो. Union types ने एखाद्या variable ला अनेक possible types पैकी एक असू देतो — pipe symbol ने types जोडतात. जसे एक variable string किंवा number दोन्ही असू शकतो. Union types खासकरून तेव्हा उपयुक्त असतात जेव्हा function वेगवेगळे types accept करू शकतो. Literal types ने आपण specific values लाच allow करतो, जसे फक्त 'small', 'medium', किंवा 'large' string values. हे खूप उपयुक्त आहे जेव्हा आपल्याला माहीत असते की variable फक्त काही fixed values च घेऊ शकतो — जसे status field जो फक्त 'pending', 'completed', किंवा 'cancelled' असू शकतो. Type aliases code ला readable आणि reusable बनवतात.",
    example: 'type ID = string | number;\n\ntype Status = "pending" | "completed" | "cancelled";\n\nfunction printID(id: ID): void {\n    console.log("ID आहे: " + id);\n}\n\nfunction updateStatus(status: Status): void {\n    console.log("Status: " + status);\n}\n\nprintID(101);\nprintID("STU-101");\nupdateStatus("completed");\n\n// updateStatus("done");  // Error! "done" valid status नाही'
  },
  {
    id: 6,
    title: "Classes मध्ये Types",
    content: "TypeScript classes मध्ये प्रत्येक field चा type सांगणे आवश्यक आहे. access modifiers — public, private, protected — TypeScript मध्ये strictly enforce होतात, जे plain JavaScript मध्ये नव्हते. private field ला class च्या बाहेर access केल्यावर compile-time error येते, जे data ला secure बनवते. Constructor च्या parameters मध्ये देखील types देतात. TypeScript मध्ये एक shorthand आहे जिथे constructor च्या parameters मध्ये directly public/private लिहून field declaration देखील आपोआप होते. Interfaces ला classes सोबत implement keyword ने वापरता येते, ज्यामुळे class ला त्या interface च्या सर्व properties आणि methods provide कराव्या लागतात. Inheritance तशीच काम करते जशी JavaScript मध्ये extends keyword ने, पण types सोबत अतिरिक्त safety मिळते.",
    example: 'class Student {\n    private naam: string;\n    public vay: number;\n    \n    constructor(naam: string, vay: number) {\n        this.naam = naam;\n        this.vay = vay;\n    }\n    \n    public displayInfo(): void {\n        console.log(this.naam + " - " + this.vay + " वर्षे");\n    }\n}\n\n// Shorthand constructor\nclass Teacher {\n    constructor(public naam: string, private subject: string) {}\n    \n    getSubject(): string {\n        return this.subject;\n    }\n}\n\nconst s1 = new Student("Sharada", 20);\ns1.displayInfo();\n\nconst t1 = new Teacher("Priya", "Mathematics");\nconsole.log(t1.naam, t1.getSubject());'
  },
  {
    id: 7,
    title: "Generics — Reusable Type-Safe Code",
    content: "Generics ने आपण असे functions आणि classes बनवू शकतो जे कोणत्याही type सोबत काम करतात, पण तरीही type safety राहते. Angular brackets <T> मध्ये एक placeholder type लिहतात जो actual वापरताना खऱ्या type ने replace होतो. हे अगदी function parameters सारखे काम करते, फक्त values ऐवजी types साठी. Generic function कोणताही type accept करू शकतो आणि तोच type return करतो, ज्यामुळे flexibility आणि type safety दोन्ही मिळतात. Generic interfaces आणि classes देखील बनवू शकतो — जसे एक Box class जो कोणत्याही type ची value ठेवू शकेल. Multiple generic types देखील एकत्र वापरू शकतो जसे <T, U>. Generics TypeScript च्या सर्वात powerful features पैकी एक आहेत कारण ते code reuse करू देतात type safety न गमावता.",
    example: 'function identity<T>(value: T): T {\n    return value;\n}\n\ninterface Box<T> {\n    content: T;\n}\n\nfunction getFirstItem<T>(items: T[]): T {\n    return items[0];\n}\n\nconst numBox: Box<number> = { content: 42 };\nconst strBox: Box<string> = { content: "नमस्कार" };\n\nconsole.log(identity<string>("Sharada"));\nconsole.log(identity<number>(25));\n\nconst fruits: string[] = ["apple", "banana", "mango"];\nconsole.log(getFirstItem(fruits));\n\nconsole.log(numBox.content);\nconsole.log(strBox.content);'
  },
  {
    id: 8,
    title: "Enums — Named Constants",
    content: "Enum म्हणजे enumeration ने आपण related constants चा एक set define करू शकतो ज्यांची readable नावे असतात. enum keyword ने enum बनवतो. Default रूपात enum members ला 0 पासून सुरू होणाऱ्या numbers मिळतात, आणि प्रत्येक पुढचा member मागच्यापेक्षा एक जास्त असतो. आपण स्वतः specific numbers देखील assign करू शकतो. String enums मध्ये प्रत्येक member ला एक specific string value देतात जी जास्त readable असते debugging च्या वेळी. Enums खासकरून तेव्हा उपयुक्त असतात जेव्हा आपल्याला माहीत असते की variable फक्त काही specific predefined values च घेऊ शकतो, जसे days of week, directions, किंवा status types. Enum वापरल्याने magic numbers किंवा strings ऐवजी meaningful names मिळतात ज्यामुळे code वाचणे सोपे होते.",
    example: 'enum Status {\n    Pending,\n    InProgress,\n    Completed,\n    Cancelled\n}\n\nenum Direction {\n    Up = "UP",\n    Down = "DOWN",\n    Left = "LEFT",\n    Right = "RIGHT"\n}\n\nfunction updateOrder(status: Status): void {\n    if (status === Status.Completed) {\n        console.log("Order पूर्ण झाला!");\n    } else if (status === Status.Pending) {\n        console.log("Order pending आहे");\n    }\n}\n\nupdateOrder(Status.Completed);\nconsole.log(Direction.Up);\nconsole.log(Status.InProgress);  // 1 print होईल'
  },
  {
    id: 9,
    title: "TypeScript Setup आणि Compile करणे",
    content: "TypeScript वापरण्यासाठी आधी npm install -g typescript ने global install करतो. tsc compiler command आहे जी TypeScript file ला JavaScript मध्ये convert करते. एक .ts extension असलेली file बनवतो ज्यात TypeScript code लिहतो. tsc filename.ts चालवल्याने त्याच नावाची .js file बनते. tsconfig.json file project च्या settings ठेवते जसे target JavaScript version, strict mode on/off, आणि कोणते folders compile करायचे. strict: true सर्वात recommended setting आहे कारण ही सर्व strict type checking features enable करते. Modern projects मध्ये बऱ्याचदा ts-node वापरतात जो आधी compile न करता directly TypeScript run करतो development च्या वेळी. Webpack आणि Vite सारख्या build tools मध्ये देखील TypeScript चा built-in support असतो.",
    example: '// terminal commands:\n// npm install -g typescript\n// tsc --init   (tsconfig.json बनवण्यासाठी)\n// tsc app.ts   (compile करण्यासाठी)\n// node app.js  (run करण्यासाठी)\n\n// tsconfig.json उदाहरण:\n// {\n//   "compilerOptions": {\n//     "target": "ES2020",\n//     "strict": true,\n//     "outDir": "./dist"\n//   }\n// }\n\n// app.ts\nfunction namaskaar(naam: string): string {\n    return "नमस्कार " + naam + "!";\n}\n\nconsole.log(namaskaar("Sharada"));'
  },
  {
    id: 10,
    title: "Mini Project — Type-Safe Todo List",
    content: "शाब्बास! तुम्ही TypeScript चे सर्व महत्त्वाचे concepts शिकलात. आता आपण सर्व एकत्र करून एक Type-Safe Todo List Manager बनवूया. या project मध्ये आपण interfaces, enums, generics, classes, आणि functions सर्व वापरू. हे project दाखवेल की TypeScript real applications मध्ये bugs आधीच कसे पकडतो, runtime पर्यंत wait करावे लागत नाही. आपण एक Todo interface बनवू ज्यात properties असतील, एक Priority enum असेल, आणि एक TodoManager class असेल जो todos add, complete, आणि display करेल. हे project तुम्हाला दाखवेल की TypeScript professional applications मध्ये development किती safer आणि faster बनवतो.",
    example: 'interface Todo {\n    id: number;\n    title: string;\n    priority: Priority;\n    completed: boolean;\n}\n\nenum Priority {\n    Low = "कमी",\n    Medium = "मध्यम",\n    High = "जास्त"\n}\n\nclass TodoManager {\n    private todos: Todo[] = [];\n    private nextId: number = 1;\n    \n    addTodo(title: string, priority: Priority): void {\n        const newTodo: Todo = {\n            id: this.nextId++,\n            title: title,\n            priority: priority,\n            completed: false\n        };\n        this.todos.push(newTodo);\n        console.log(title + " add झाले!");\n    }\n    \n    completeTodo(id: number): void {\n        const todo = this.todos.find(t => t.id === id);\n        if (todo) {\n            todo.completed = true;\n            console.log(todo.title + " complete झाले!");\n        }\n    }\n    \n    displayAll(): void {\n        console.log("=== सर्व Todos ===");\n        this.todos.forEach(t => {\n            const status = t.completed ? "✓" : "○";\n            console.log(status + " " + t.title + " [" + t.priority + "]");\n        });\n    }\n}\n\nconst manager = new TodoManager();\nmanager.addTodo("Python शिका", Priority.High);\nmanager.addTodo("Groceries आणा", Priority.Low);\nmanager.completeTodo(1);\nmanager.displayAll();'
  },
]



// ─── Pyra SVG Mascot ───────────────────────────────────────────────────────────
function PyraMascot({ size = 56, speaking = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
      aria-hidden="true">
      <style>{`
        @keyframes antennaBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes blink { 0%,90%,100%{scaleY:1} 95%{scaleY:0.1} }
        @keyframes speakPulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .antenna { animation: antennaBob 2s ease-in-out infinite; transform-origin: 28px 10px; }
        .eye { animation: blink 3.5s ease-in-out infinite; transform-origin: center; }
        .speak-ring { animation: speakPulse 0.6s ease-in-out infinite; }
      `}</style>
      {/* Antenna */}
      <g className="antenna">
        <line x1="28" y1="10" x2="28" y2="4" stroke="#1cb0f6" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="28" cy="3" r="2.5" fill="#1cb0f6"/>
      </g>
      {/* Body */}
      <rect x="10" y="12" width="36" height="30" rx="8" fill="#1cb0f6"/>
      {/* Face plate */}
      <rect x="14" y="16" width="28" height="20" rx="5" fill="#0a8fd4"/>
      {/* Eyes */}
      <ellipse className="eye" cx="21" cy="24" rx="3.5" ry="3.5" fill="white"/>
      <ellipse className="eye" cx="35" cy="24" rx="3.5" ry="3.5" fill="white"/>
      <circle cx="21" cy="24" r="1.5" fill="#003d6b"/>
      <circle cx="35" cy="24" r="1.5" fill="#003d6b"/>
      {/* Mouth */}
      {speaking ? (
        <rect x="18" y="30" width="20" height="3" rx="1.5" fill="#58cc02" className="speak-ring"/>
      ) : (
        <path d="M19 31 Q28 35 37 31" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      )}
      {/* Ears/side panels */}
      <rect x="6" y="20" width="4" height="8" rx="2" fill="#0a8fd4"/>
      <rect x="46" y="20" width="4" height="8" rx="2" fill="#0a8fd4"/>
      {/* Legs */}
      <rect x="17" y="42" width="8" height="6" rx="3" fill="#0a8fd4"/>
      <rect x="31" y="42" width="8" height="6" rx="3" fill="#0a8fd4"/>
    </svg>
  )
}

// ─── Bouncing dots indicator ───────────────────────────────────────────────────
function BouncingDots({ label = "Pyra सुन रही है..." }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }} aria-live="polite" aria-label={label}>
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        .dot1{animation:bounce 1s ease-in-out infinite}
        .dot2{animation:bounce 1s ease-in-out 0.16s infinite}
        .dot3{animation:bounce 1s ease-in-out 0.32s infinite}
      `}</style>
      <span style={{ fontSize: "0.85rem", color: "#1cb0f6", fontWeight: 500 }}>{label}</span>
      {["dot1","dot2","dot3"].map(c => (
        <span key={c} className={c} style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:"#1cb0f6" }}/>
      ))}
    </span>
  )
}

function LessonsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = location.state?.name || "दोस्त"
  const language = location.state?.language || "python"
  const instructionLang = location.state?.instructionLang || "hindi"
  const userId = location.state?.user_id

  const lessons = instructionLang === "english"
  ? (language === "sql" ? sqlLessonsEnglish
    : language === "javascript" ? javascriptLessonsEnglish
    : language === "java" ? javaLessonsEnglish
    : language === "cpp" ? cppLessonsEnglish
    : language === "html" ? htmlLessonsEnglish
    : language === "css" ? cssLessonsEnglish
    : language === "tailwind" ? tailwindLessonsEnglish
    : language === "typescript" ? typescriptLessonsEnglish
    : pythonLessonsEnglish)
  : instructionLang === "marathi"
  ? (language === "sql" ? sqlLessonsMarathi
    : language === "javascript" ? javascriptLessonsMarathi
    : language === "java" ? javaLessonsMarathi
    : language === "cpp" ? cppLessonsMarathi
    : language === "html" ? htmlLessonsMarathi
    : language === "css" ? cssLessonsMarathi
    : language === "tailwind" ? tailwindLessonsMarathi
    : language === "typescript" ? typescriptLessonsMarathi
    : pythonLessonsMarathi)
  : (language === "sql" ? sqlLessons
    : language === "javascript" ? javascriptLessons
    : language === "java" ? javaLessons
    : language === "cpp" ? cppLessons
    : language === "html" ? htmlLessons
    : language === "css" ? cssLessons
    : language === "tailwind" ? tailwindLessons
    : language === "typescript" ? typescriptLessons
    : pythonLessons)
  const lang = t[instructionLang]

  const [progressData, setProgressData] = useState({ lessons_done: false, mcq_done: false, agent_done: false, current_lesson_index: 0 })
  const [currentLesson, setCurrentLesson] = useState(0)
  const [step, setStep] = useState("intro")
  const [status, setStatus] = useState("")
  const [lastMessage, setLastMessage] = useState("")
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const { theme, toggleTheme, bg, textColor, cardBg, cardBorder, mutedColor, codeBg,
  accent, accentText, accentSoft, accentHover, accentShadow,
  success, successShadow, gold, goldShadow,
  fontSize, setFontSize, speed, setSpeed
} = useTheme()

  const isDark = theme === "dark"

  function speak(text, onEnd) {
    window.speechSynthesis.cancel()
    setLastMessage(text)
    setSpeaking(true)
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
      if (!preferred) preferred = voices.find(v => v.lang === lang.voiceLang)
      if (preferred) utterance.voice = preferred
      utterance.onend = () => { setSpeaking(false); if (onEnd) onEnd() }
      utterance.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = trySpeak
    } else {
      trySpeak()
    }
  }

  const [streakDays, setStreakDays] = useState(0)
  const [resumeChoicePending, setResumeChoicePending] = useState(null) // holds savedIndex while waiting, else null
  const [resumeListenAttempts, setResumeListenAttempts] = useState(0)
  const pendingMessagesRef = useRef([])
  
  useEffect(() => {
    function speakQueue(messages, i = 0) {
      if (i >= messages.length) return
      speak(messages[i], () => speakQueue(messages, i + 1))
    }

    function buildWelcomeMsg() {
      return lang.welcome(name) + " " + lang.pressL + " " + lang.pressN + " " + lang.pressR
    }

    function buildStreakMsg(days) {
      return instructionLang === "hindi"
        ? `${days} दिन की streak! 🔥 शानदार लगातार मेहनत!`
        : instructionLang === "marathi"
        ? `${days} दिवसांची streak! 🔥 उत्तम सातत्य!`
        : `${days}-day streak! 🔥 Great consistency!`
    }

    if (!userId) {
      setTimeout(() => {
        speakQueue([buildWelcomeMsg()])
        setStatus(lang.status)
        setStep("ready")
      }, 1000)
      return
    }

    fetch(`http://127.0.0.1:8000/progress/${userId}`)
      .then(res => res.json())
      .then(data => {
        const match = data.progress?.find(p => p.language === language)
        let savedIndex = 0
        if (match) {
          setProgressData(match)
          savedIndex = match.current_lesson_index || 0
        }
        if (typeof data.streak_days === "number") {
          setStreakDays(data.streak_days)
        }

        const remaining = [buildWelcomeMsg()]
        if (typeof data.streak_days === "number" && data.streak_days >= 2) {
          remaining.push(buildStreakMsg(data.streak_days))
        }

        setTimeout(() => {
          setStatus(lang.status)
          setStep("ready")

          if (savedIndex > 0 && savedIndex < lessons.length) {
            const questionMsg = instructionLang === "hindi"
  ? `स्वागत है ${name}। यह Lessons page है। आप lesson ${savedIndex + 1} पर थे। वहीं से जारी रखने के लिए C दबाएं, या शुरुआत से शुरू करने के लिए S दबाएं। आप T दबाकर बोल भी सकते हैं।`
  : instructionLang === "marathi"
  ? `स्वागत आहे ${name}. हे Lessons page आहे. तुम्ही lesson ${savedIndex + 1} वर होता. तिथून सुरू ठेवण्यासाठी C दाबा, किंवा सुरुवातीपासून सुरू करण्यासाठी S दाबा. तुम्ही T दाबून बोलूनही सांगू शकता.`
  : `Welcome ${name}. This is the Lessons page. You were on lesson ${savedIndex + 1}. Press C to continue from there, or S to start from the beginning. You can also press T and say it out loud.`
            pendingMessagesRef.current = remaining
            speak(questionMsg, () => {
              setResumeChoicePending(savedIndex)
              setResumeListenAttempts(0)
              listenForResumeChoice()
            })
          } else {
            speakQueue(remaining)
          }
        }, 1000)
      })
      .catch(() => {
        setTimeout(() => {
          speakQueue([buildWelcomeMsg()])
          setStatus(lang.status)
          setStep("ready")
        }, 1000)
      })
  }, [userId, language])

  function resolveResumeChoice(shouldResume) {
    const savedIndex = resumeChoicePending
    setResumeChoicePending(null)
    if (shouldResume && savedIndex != null) {
      setCurrentLesson(savedIndex)
    } else {
      setCurrentLesson(0)
    }
    const remaining = pendingMessagesRef.current
    pendingMessagesRef.current = []
    function speakQueue(messages, i = 0) {
      if (i >= messages.length) return
      speak(messages[i], () => speakQueue(messages, i + 1))
    }
    speakQueue(remaining)
  }

  function listenForResumeChoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const recognition = new SpeechRecognition()
    recognition.lang = lang.voiceLang
    recognition.start()
    setListening(true)

    recognition.onresult = (e) => {
      const answer = e.results[0][0].transcript.toLowerCase()
      setListening(false)

      const resumeWords = ["continue", "resume", "जारी", "तिथून", "वहीं", "वही", "haan", "हाँ", "हा", "aage", "आगे", "yes", "chalu", "चालू"]
      const restartWords = ["restart", "start over", "शुरुआत", "सुरुवात", "naya", "नया", "फिर", "again", "no", "नाही", "नहीं"]

      const wantsResume = resumeWords.some(w => answer.includes(w))
      const wantsRestart = restartWords.some(w => answer.includes(w))

      if (wantsResume) {
        resolveResumeChoice(true)
      } else if (wantsRestart) {
        resolveResumeChoice(false)
      } else {
        setResumeListenAttempts(prev => {
          const next = prev + 1
          if (next >= 2) {
            speak("समझ नहीं आया। कृपया C या S दबाएं।")
          } else {
            speak("समझ नहीं आया। फिर से कोशिश करें, या C या S दबाएं।", () => listenForResumeChoice())
          }
          return next
        })
      }
    }

    recognition.onerror = () => setListening(false)
  }

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
    postProgressUpdate({ user_id: userId, language, ...fields })
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

      if (resumeChoicePending !== null) {
        if (key === "c") resolveResumeChoice(true)
        if (key === "s") resolveResumeChoice(false)
        if (key === "t") listenForResumeChoice()
        return
      }

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
  }, [currentLesson, step, lastMessage, resumeChoicePending])

  const lesson = lessons[currentLesson]
  const lessonProgress = Math.round((currentLesson / lessons.length) * 100)

  // ── Shared 3D button style factory ──────────────────────────────────────────
  const btn3d = ({ bg, shadow, color = "#fff", flex = 1 }) => ({
    flex,
    padding: "0.85rem 0.5rem",
    fontSize: "0.9rem",
    fontWeight: 700,
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: bg,
    color,
    boxShadow: `0 4px 0 0 ${shadow}`,
    transition: "box-shadow 0.1s, transform 0.1s",
    position: "relative",
    top: 0,
  })

  const btn3dActive = {
    boxShadow: "0 0px 0 0 transparent",
    transform: "translateY(3px)",
  }

  const [activeBtn, setActiveBtn] = useState(null)

  const btnPress = (id) => { setActiveBtn(id) }
  const btnRelease = () => { setActiveBtn(null) }

  // ── Card / page tokens ───────────────────────────────────────────────────────
  const pageStyle = {
    minHeight: "100vh",
    background: bg,
    fontFamily: "'Segoe UI', sans-serif",
    padding: "1rem",
    fontSize: fontSize + "px",
  }

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    boxShadow: `0 2px 0 0 ${cardBorder}`,
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1.25rem",
  }

  const langLabel = language === "sql" ? "SQL" : language === "javascript" ? "JavaScript" : "Python"

  const pageContext = instructionLang === "hindi"
    ? `पाठ ${currentLesson + 1} में से ${lessons.length}, ${langLabel}`
    : instructionLang === "marathi"
    ? `धडा ${currentLesson + 1} पैकी ${lessons.length}, ${langLabel}`
    : `Lesson ${currentLesson + 1} of ${lessons.length}, ${langLabel}`

    const helpText = instructionLang === "hindi"
    ? "L = Lesson सुनें, N = अगली lesson, R = दोबारा सुनें, T = आवाज़ से जवाब दें, B = Sidebar toggle"
    : instructionLang === "marathi"
    ? "L = Lesson ऐका, N = पुढील lesson, R = पुन्हा ऐका, T = आवाजाने उत्तर द्या, B = Sidebar toggle"
    : "L to listen to the lesson, N for next lesson, R to repeat, T to answer by voice, B to toggle sidebar"

  return (
    <>
      <style>{`
        .lesson-btn:active { box-shadow: 0 0px 0 0 transparent !important; transform: translateY(3px) !important; }
        .lesson-btn { transition: box-shadow 0.1s, transform 0.1s; }
        @keyframes micPulse {
          0% { box-shadow: 0 0 0 0 rgba(28,176,246,0.5), 0 4px 0 0 #0a8fd4; }
          70% { box-shadow: 0 0 0 12px rgba(28,176,246,0), 0 4px 0 0 #0a8fd4; }
          100% { box-shadow: 0 0 0 0 rgba(28,176,246,0), 0 4px 0 0 #0a8fd4; }
        }
        .mic-listening { animation: micPulse 1s ease-out infinite !important; }
      `}</style>

      <main id="main-content" tabIndex={-1} aria-label="Lessons पृष्ठ" style={{ ...pageStyle, outline: "none" }}>
        <div style={{ width: "100%", maxWidth: "1100px", margin: "0 auto" }}>

          <Navbar
  name={name} theme={theme} toggleTheme={toggleTheme}
  fontSize={fontSize} setFontSize={setFontSize}
  speed={speed} setSpeed={setSpeed}
  language={language} instructionLang={instructionLang}
  userId={userId}
  cardBg={cardBg} cardBorder={cardBorder} mutedColor={mutedColor}
  accent={accent} accentText={accentText} accentSoft={accentSoft}
  borderWidth={"1px"}
  pageContext={pageContext}
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
              {/* Header with Pyra mascot */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                <PyraMascot size={52} speaking={speaking} />
                <div style={{ flex: 1 }}>
                  <h1 style={{ color: accent, fontSize: "1.6rem", margin: 0, fontWeight: 700, lineHeight: 1.2 }}>
                    {langLabel} Lessons
                  </h1>
                  <p style={{ color: mutedColor, margin: "0.2rem 0 0", fontSize: "0.9rem" }}>
                    नमस्ते {name}!
                    {speaking && <span style={{ marginLeft: "0.5rem" }}><BouncingDots label="Pyra बोल रही है..." /></span>}
                  </p>
                </div>
                {streakDays >= 2 && (
                  <span
                    role="status"
                    aria-label={`${streakDays} day streak`}
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: gold,
                      background: isDark ? "rgba(255,200,0,0.1)" : "#fff8e1",
                      border: `1px solid ${isDark ? "rgba(255,200,0,0.3)" : "#ffe082"}`,
                      borderRadius: "10px",
                      padding: "0.4rem 0.7rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    🔥 {streakDays} day{streakDays !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Overall progress bar (lessons / mcq / agent) */}
              <ProgressBar
                lessons={progressData.lessons_done}
                mcq={progressData.mcq_done}
                agent={progressData.agent_done}
                theme={theme}
              />

              {/* Lesson progress bar */}
              <div style={{ ...cardStyle, padding: "0.9rem 1.25rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ color: mutedColor, fontSize: "0.8rem", fontWeight: 500 }}>Lesson Progress</span>
                  <span style={{ color: accent, fontSize: "0.8rem", fontWeight: 700 }}>{currentLesson}/{lessons.length}</span>
                </div>
                <div style={{ background: isDark ? "rgba(28,176,246,0.12)" : "#e8f7fe", borderRadius: "8px", height: "8px", overflow: "hidden" }}>
                  <div style={{
                    background: `linear-gradient(90deg, ${accent}, ${success})`,
                    width: lessonProgress + "%",
                    height: "8px",
                    borderRadius: "8px",
                    transition: "width 0.5s ease",
                  }} />
                </div>
              </div>

              {/* Lesson card */}
              <div style={cardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <span style={{
                    background: accent,
                    color: "#fff",
                    borderRadius: "50%",
                    width: "30px", height: "30px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "0.85rem",
                    flexShrink: 0,
                    boxShadow: `0 2px 0 0 ${accentShadow}`,
                  }}>{lesson.id}</span>
                  <h2 style={{ color: accent, margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>{lesson.title}</h2>
                </div>

                <p style={{ color: textColor, lineHeight: "1.75", marginBottom: lesson.example ? "1rem" : 0 }}>
                  {lesson.content}
                </p>

                {lesson.example && (
                  <div style={{
                    background: codeBg,
                    border: `1px solid ${cardBorder}`,
                    boxShadow: `0 2px 0 0 ${cardBorder}`,
                    borderRadius: "12px",
                    padding: "1rem",
                  }}>
                    <p style={{ color: mutedColor, fontSize: "0.75rem", margin: "0 0 0.5rem", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>उदाहरण</p>
                    <pre style={{ color: success, margin: 0, fontSize: "0.95rem", fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                      {lesson.example}
                    </pre>
                  </div>
                )}

                {/* Status / listening indicator */}
                {status !== "" && (
                  <div
                    aria-live={speaking ? "off" : "polite"}
                    style={{
                      marginTop: "1rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      background: isDark ? "rgba(28,176,246,0.1)" : "#e8f7fe",
                      border: `1px solid ${isDark ? "rgba(28,176,246,0.2)" : "#b3e5fc"}`,
                    }}
                  >
                    {listening
                      ? <BouncingDots label="Pyra सुन रही है..." />
                      : <span style={{ color: accent, fontSize: "0.88rem", fontWeight: 500 }}>{status}</span>
                    }
                  </div>
                )}
              </div>

              {/* Action buttons — 3D press style */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {/* Listen */}
                <button
                  className="lesson-btn"
                  onClick={playLesson}
                  aria-label="L — Lesson सुनें"
                  style={btn3d({ bg: accent, shadow: accentShadow, color: "#fff" })}
                >
                  {lang.listenBtn}<br />
                  <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>(L)</span>
                </button>

                {/* Repeat */}
                <button
                  className="lesson-btn"
                  onClick={() => speak(lastMessage)}
                  aria-label="R — दोबारा सुनें"
                  style={btn3d({
                    bg: isDark ? "rgba(255,255,255,0.06)" : "#f0f4f8",
                    shadow: cardBorder,
                    color: textColor,
                  })}
                >
                  दोबारा<br />
                  <span style={{ fontSize: "0.72rem", color: accent }}>(R)</span>
                </button>

                {/* Mic */}
                <button
                  className={`lesson-btn${listening ? " mic-listening" : ""}`}
                  onClick={startListening}
                  disabled={listening}
                  aria-label="T — आवाज़ से जवाब दें"
                  style={{
                    ...btn3d({ bg: accent, shadow: accentShadow, color: "#fff" }),
                    opacity: listening ? 0.9 : 1,
                  }}
                >
                  {listening ? "🎤 सुन रही हूँ" : "🎤 बोलें"}<br />
                  <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>(T)</span>
                </button>

                {/* Next / MCQ */}
                <button
                  className="lesson-btn"
                  onClick={step === "done"
                    ? () => navigate("/mcq", { state: { name, language, instructionLang, user_id: userId } })
                    : nextLesson
                  }
                  aria-label="N — अगला lesson"
                  style={btn3d({
                    bg: step === "done" ? gold : success,
                    shadow: step === "done" ? goldShadow : successShadow,
                    color: "#fff",
                  })}
                >
                  {step === "done" ? "🏆 MCQ" : "अगला →"}<br />
                  <span style={{ fontSize: "0.72rem", opacity: 0.8 }}>(N)</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default LessonsPage