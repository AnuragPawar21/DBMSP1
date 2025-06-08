-- Insert 5 subjects with IDs 1-5
INSERT INTO subjects (id, name) VALUES (1, 'DBMS');
INSERT INTO subjects (id, name) VALUES (2, 'Java');
INSERT INTO subjects (id, name) VALUES (3, 'IPCV');
INSERT INTO subjects (id, name) VALUES (4, 'Data Analysis');
INSERT INTO subjects (id, name) VALUES (5, 'Probability Theory');
-- Reset the auto-increment counter to 5
UPDATE sqlite_sequence SET seq = 5 WHERE name = 'subjects';

-- ✅ Insert DBMS Chapters (subject_id = 1 after above insert)
INSERT INTO chapters (subject_id, chapter_number, title) VALUES
(1, 1, 'Introduction to Databases'),
(1, 2, 'Relational DBMS and SQL'),
(1, 3, 'Normalization'),
(1, 4, 'NoSQL Databases'),
(1, 5, 'DBMS Implementation');

-- ✅ FLASHCARDS: Chapter 1 (chapter_id = 1)
INSERT INTO flashcards (chapter_id, question, answer) VALUES
(1, 'What is a database?', 'A database is a structured collection of data that can be easily accessed, managed, and updated.'),
(1, 'What is DBMS?', 'DBMS stands for Database Management System; it is software used to manage databases.'),
(1, 'List types of DBMS.', 'Hierarchical, Network, Relational, Object-Oriented.'),
(1, 'What is data redundancy?', 'It is the duplication of data in a database.'),
(1, 'Define data independence.', 'Ability to modify schema at one level without affecting other levels.'),
(1, 'What is a data model?', 'A data model defines the structure, storage, and relationships of data.'),
(1, 'Name types of data models.', 'Hierarchical, Network, Relational, Entity-Relationship.'),
(1, 'What is a schema?', 'Schema is the logical structure of the database.'),
(1, 'Define instance of a database.', 'The data stored in a database at a particular moment.'),
(1, 'What is 3-tier architecture?', 'Presentation, Application, and Data tiers.'),
(1, 'What is a database system?', 'DBMS + database is called a database system.'),
(1, 'What is metadata?', 'Data that describes other data.'),
(1, 'Give an example of a real-time database.', 'Banking systems or reservation systems.'),
(1, 'What is an entity?', 'An object that exists and is distinguishable from other objects.'),
(1, 'Difference between DBMS and RDBMS?', 'RDBMS uses relations (tables); DBMS may not follow relational model.');

-- ✅ FLASHCARDS: Chapter 2 (chapter_id = 2)
INSERT INTO flashcards (chapter_id, question, answer) VALUES
(2, 'What is SQL?', 'Structured Query Language used to manage relational databases.'),
(2, 'Types of SQL commands?', 'DDL, DML, DCL, TCL.'),
(2, 'What is DDL?', 'Data Definition Language — defines database structure.'),
(2, 'What is DML?', 'Data Manipulation Language — manages data in tables.'),
(2, 'What is a primary key?', 'A unique identifier for table rows.'),
(2, 'Define foreign key.', 'A field that links to a primary key in another table.'),
(2, 'What is a constraint?', 'A rule applied to data in a table.'),
(2, 'Examples of SQL constraints?', 'NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK.'),
(2, 'What is a SELECT statement?', 'Retrieves data from a table.'),
(2, 'Syntax for inserting a record?', 'INSERT INTO table (columns) VALUES (values);'),
(2, 'How do you update a record?', 'UPDATE table SET column = value WHERE condition;'),
(2, 'What does DELETE do?', 'Removes records from a table.'),
(2, 'Difference between WHERE and HAVING?', 'WHERE filters rows, HAVING filters groups.'),
(2, 'What is a JOIN?', 'Combines rows from two or more tables.'),
(2, 'Types of JOINs?', 'INNER, LEFT, RIGHT, FULL OUTER.');

-- ✅ FLASHCARDS: Chapter 3 (chapter_id = 3)
INSERT INTO flashcards (chapter_id, question, answer) VALUES
(3, 'What is normalization?', 'Process of reducing data redundancy and improving data integrity.'),
(3, 'What is 1NF?', 'First Normal Form — eliminates repeating groups.'),
(3, 'What is 2NF?', 'Second Normal Form — removes partial dependencies.'),
(3, 'What is 3NF?', 'Third Normal Form — removes transitive dependencies.'),
(3, 'Define BCNF.', 'Boyce-Codd Normal Form — stricter version of 3NF.'),
(3, 'What is a functional dependency?', 'Relationship between two attributes, typically ID → Name.'),
(3, 'Anomalies solved by normalization?', 'Insertion, update, deletion anomalies.'),
(3, 'What is denormalization?', 'Process of combining normalized tables to improve performance.'),
(3, 'Can a table be in 2NF but not in 3NF?', 'Yes, if transitive dependencies exist.'),
(3, 'What is a candidate key?', 'An attribute or set of attributes that can uniquely identify a row.'),
(3, 'What is a composite key?', 'A primary key made up of multiple columns.'),
(3, 'What is transitive dependency?', 'A non-prime attribute depends on another non-prime attribute.'),
(3, 'What is a surrogate key?', 'An artificial key used for uniquely identifying a row.'),
(3, 'Why normalize a database?', 'To eliminate redundancy and ensure data consistency.'),
(3, 'Drawback of over-normalization?', 'Too many tables and joins; complex queries.');

-- ✅ FLASHCARDS: Chapter 4 (chapter_id = 4)
INSERT INTO flashcards (chapter_id, question, answer) VALUES
(4, 'What is NoSQL?', 'Non-relational database for unstructured and semi-structured data.'),
(4, 'Types of NoSQL databases?', 'Document, Key-Value, Column, Graph.'),
(4, 'Example of a Document DB?', 'MongoDB.'),
(4, 'When to use NoSQL?', 'When data is unstructured or schema-less.'),
(4, 'Advantage of NoSQL over SQL?', 'High scalability and flexibility.'),
(4, 'What is a Key-Value store?', 'Stores data as key-value pairs (e.g., Redis).'),
(4, 'Define column-based DB.', 'Stores data column-wise (e.g., Cassandra).'),
(4, 'What is eventual consistency?', 'Data becomes consistent over time, not immediately.'),
(4, 'What is BASE?', 'Basically Available, Soft state, Eventually consistent.'),
(4, 'NoSQL vs RDBMS?', 'RDBMS has fixed schema; NoSQL is flexible.'),
(4, 'What is schema-less design?', 'Tables/records don’t follow a fixed structure.'),
(4, 'CAP theorem?', 'Consistency, Availability, Partition tolerance — choose 2 out of 3.'),
(4, 'Use case for Graph DB?', 'Social networks, recommendation systems.'),
(4, 'Which NoSQL supports joins?', 'Most don’t natively, but MongoDB can simulate them.'),
(4, 'How to query NoSQL?', 'Each DB has its own query mechanism, like MongoDB’s find().');

-- ✅ FLASHCARDS: Chapter 5 (chapter_id = 5)
INSERT INTO flashcards (chapter_id, question, answer) VALUES
(5, 'What is indexing in DBMS?', 'Technique to speed up data retrieval.'),
(5, 'Types of indexing?', 'Single-level, multi-level, clustered, unclustered.'),
(5, 'What is hashing?', 'Maps keys to fixed-size values for fast access.'),
(5, 'What is a transaction?', 'A unit of work performed within a DB.'),
(5, 'ACID properties?', 'Atomicity, Consistency, Isolation, Durability.'),
(5, 'What is atomicity?', 'Ensures all operations of a transaction are completed or none.'),
(5, 'Define consistency in DBMS.', 'Data must be in a valid state before and after a transaction.'),
(5, 'What is isolation?', 'Transactions occur independently.'),
(5, 'What is durability?', 'Once a transaction is committed, it remains so.'),
(5, 'What is concurrency control?', 'Manages simultaneous transactions to avoid conflicts.'),
(5, 'Deadlock in DBMS?', 'Two transactions wait indefinitely for each other.'),
(5, 'What is serializability?', 'Ensures that transactions produce consistent results.'),
(5, 'CAP theorem again?', 'You can’t simultaneously achieve Consistency, Availability, and Partition Tolerance.'),
(5, 'What is a log-based recovery?', 'Uses logs to restore database after failure.'),
(5, 'Difference between clustered and unclustered index?', 'Clustered: data stored with index. Unclustered: index separate from data.');

-- 50 MCQs for Daily Quiz (DBMS, Java, IPCV, Data Analysis, Probability Theory)
INSERT INTO mcqs (subject_id, question, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(1, 'What does SQL stand for?', 'Structured Query Language', 'Simple Query Language', 'Sequential Query Language', 'Standard Query Language', 'A', 'SQL stands for Structured Query Language.'),
(1, 'Which of the following is a NoSQL database?', 'MySQL', 'MongoDB', 'PostgreSQL', 'Oracle', 'B', 'MongoDB is a NoSQL database.'),
(1, 'Which key uniquely identifies a record in a table?', 'Foreign Key', 'Primary Key', 'Candidate Key', 'Super Key', 'B', 'Primary Key uniquely identifies a record.'),
(1, 'Which normal form removes partial dependency?', '1NF', '2NF', '3NF', 'BCNF', 'B', '2NF removes partial dependency.'),
(1, 'Which command is used to remove all records from a table?', 'DROP', 'DELETE', 'TRUNCATE', 'REMOVE', 'C', 'TRUNCATE removes all records.'),
(2, 'Which of these is not a Java keyword?', 'static', 'Boolean', 'void', 'private', 'B', 'Boolean is not a Java keyword.'),
(2, 'Which method is the entry point of a Java program?', 'start()', 'main()', 'run()', 'init()', 'B', 'main() is the entry point.'),
(2, 'Which of these is a valid identifier in Java?', '1var', '_var', 'var-1', 'var.1', 'B', '_var is valid.'),
(2, 'Which operator is used for string concatenation in Java?', '+', '&', '.', '*', 'A', '+ is used for string concatenation.'),
(2, 'Which of these is not a primitive data type in Java?', 'int', 'float', 'String', 'char', 'C', 'String is not primitive.'),
(3, 'Which is a type of image filter?', 'Low-pass', 'High-pass', 'Band-pass', 'All of the above', 'D', 'All are types of filters.'),
(3, 'What does IPCV stand for?', 'Image Processing and Computer Vision', 'Image Processing and Computer Verification', 'Image Programming and Computer Vision', 'Image Processing and Computer Validation', 'A', 'IPCV = Image Processing and Computer Vision.'),
(3, 'Which color model is used in digital image processing?', 'RGB', 'CMYK', 'HSV', 'All of the above', 'D', 'All are used.'),
(3, 'Which transform is used for image compression?', 'Fourier', 'Wavelet', 'Hough', 'Radon', 'B', 'Wavelet is used for compression.'),
(3, 'Which is not an edge detection operator?', 'Sobel', 'Prewitt', 'Canny', 'Median', 'D', 'Median is not an edge detector.'),
(4, 'Which is a measure of central tendency?', 'Mean', 'Variance', 'Standard Deviation', 'Range', 'A', 'Mean is a measure of central tendency.'),
(4, 'Which chart is best for categorical data?', 'Bar chart', 'Line chart', 'Scatter plot', 'Histogram', 'A', 'Bar chart is best.'),
(4, 'Which is not a type of data?', 'Nominal', 'Ordinal', 'Cardinal', 'Interval', 'C', 'Cardinal is not a type.'),
(4, 'Which is used for data normalization?', 'Min-Max', 'Z-score', 'Decimal scaling', 'All of the above', 'D', 'All are used.'),
(4, 'Which is not a measure of dispersion?', 'Variance', 'Mean', 'Range', 'Standard Deviation', 'B', 'Mean is not a measure of dispersion.'),
(5, 'What is the probability of getting a head in a fair coin toss?', '0.25', '0.5', '0.75', '1', 'B', 'Probability is 0.5.'),
(5, 'Which is not a type of probability?', 'Classical', 'Empirical', 'Subjective', 'Objective', 'D', 'Objective is not a type.'),
(5, 'What is the sum of probabilities of all possible outcomes?', '0', '0.5', '1', '2', 'C', 'Sum is always 1.'),
(5, 'Which distribution is used for yes/no outcomes?', 'Normal', 'Binomial', 'Poisson', 'Uniform', 'B', 'Binomial is for yes/no.'),
(5, 'Which is not a continuous probability distribution?', 'Normal', 'Poisson', 'Uniform', 'Exponential', 'B', 'Poisson is discrete.'),
-- 25 more MCQs for variety
(1, 'Which SQL clause is used to filter results?', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'A', 'WHERE filters results.'),
(1, 'Which of these is not a type of join in SQL?', 'INNER', 'OUTER', 'LEFT', 'RIGHT', 'B', 'OUTER is not a join type.'),
(1, 'Which command is used to add a new row?', 'INSERT', 'UPDATE', 'DELETE', 'SELECT', 'A', 'INSERT adds a row.'),
(1, 'Which is not a valid SQL data type?', 'VARCHAR', 'INT', 'FLOAT', 'ARRAY', 'D', 'ARRAY is not valid in SQL.'),
(1, 'Which is used to remove a table?', 'DROP', 'DELETE', 'TRUNCATE', 'REMOVE', 'A', 'DROP removes a table.'),
(2, 'Which is not a Java access modifier?', 'public', 'private', 'protected', 'package', 'D', 'package is not an access modifier.'),
(2, 'Which is used for inheritance in Java?', 'extends', 'implements', 'inherits', 'derives', 'A', 'extends is used.'),
(2, 'Which is not a loop in Java?', 'for', 'while', 'repeat', 'do-while', 'C', 'repeat is not a loop.'),
(2, 'Which is not a Java operator?', '+', '-', '*', '++-', 'D', '++- is not an operator.'),
(2, 'Which is used to handle exceptions?', 'try-catch', 'if-else', 'for', 'switch', 'A', 'try-catch handles exceptions.'),
(3, 'Which is not a color model?', 'RGB', 'CMYK', 'XYZ', 'ABC', 'D', 'ABC is not a color model.'),
(3, 'Which is used for edge detection?', 'Sobel', 'Median', 'Mean', 'Mode', 'A', 'Sobel is for edge detection.'),
(3, 'Which is not a type of filter?', 'Low-pass', 'High-pass', 'Band-stop', 'Band-pass', 'C', 'Band-stop is not a filter.'),
(3, 'Which is used for image segmentation?', 'Thresholding', 'Filtering', 'Compression', 'Encryption', 'A', 'Thresholding is used.'),
(3, 'Which is not a transform?', 'Fourier', 'Wavelet', 'Laplace', 'Median', 'D', 'Median is not a transform.'),
(4, 'Which is not a type of chart?', 'Bar', 'Pie', 'Line', 'Cube', 'D', 'Cube is not a chart.'),
(4, 'Which is used for outlier detection?', 'Box plot', 'Histogram', 'Scatter plot', 'All of the above', 'A', 'Box plot is used.'),
(4, 'Which is not a data type?', 'Nominal', 'Ordinal', 'Cardinal', 'Interval', 'C', 'Cardinal is not a data type.'),
(4, 'Which is used for data scaling?', 'Min-Max', 'Z-score', 'Decimal', 'All of the above', 'D', 'All are used.'),
(4, 'Which is not a measure of central tendency?', 'Mean', 'Median', 'Mode', 'Variance', 'D', 'Variance is not a measure of central tendency.'),
(5, 'Which is not a probability distribution?', 'Normal', 'Binomial', 'Poisson', 'Matrix', 'D', 'Matrix is not a distribution.'),
(5, 'Which is used for probability of rare events?', 'Normal', 'Binomial', 'Poisson', 'Uniform', 'C', 'Poisson is for rare events.'),
(5, 'Which is not a type of event?', 'Simple', 'Compound', 'Impossible', 'Possible', 'D', 'Possible is not a type.'),
(5, 'Which is not a property of probability?', 'Non-negativity', 'Additivity', 'Multiplicativity', 'Normalization', 'C', 'Multiplicativity is not a property.'),
(5, 'Which is not a random variable?', 'Discrete', 'Continuous', 'Constant', 'Variable', 'C', 'Constant is not a random variable.');

-- ✅ FLASHCARDS: Java Chapter 1 (chapter_id = 6)
INSERT INTO flashcards (chapter_id, question, answer) VALUES
(6, 'What is the Java Virtual Machine?', 'Executes Java bytecode and enables platform-independent code execution across operating systems.'),
(6, 'What does JDK include?', 'JDK includes compiler, debugger, JRE, and necessary development tools for Java programming.'),
(6, 'What is a Java package?', 'A namespace that organizes classes to avoid name conflicts and maintain structure.'),
(6, 'How to declare a package?', 'Use package keyword at file top to define its namespace and organization.'),
(6, 'Why use packages in Java?', 'To group related classes, reduce name conflicts, and improve modularization of code.'),
(6, 'What is an interface in Java?', 'A contract with abstract methods a class agrees to implement.'),
(6, 'Can interfaces have variables?', 'Yes, but all variables are implicitly public, static, and final constants.'),
(6, 'Can interfaces have constructors?', 'No, interfaces cannot have constructors because they cannot be instantiated directly.'),
(6, 'How to implement multiple interfaces?', 'Use implements keyword with comma-separated interface names in class declaration.'),
(6, 'Difference between class and interface?', 'Classes have state and behavior; interfaces define method signatures only.'),
(6, 'What is the default package?', 'Package with no name when no explicit package is declared in the file.'),
(6, 'Can interfaces extend other interfaces?', 'Yes, interfaces can extend multiple interfaces simultaneously in Java.'),
(6, 'What is fully qualified class name?', 'Package name plus class name to identify classes uniquely across packages.'),
(6, 'Why use interface over abstract class?', 'Interfaces allow multiple inheritance and better contract-based design structure.'),
(6, 'Can interface contain static methods?', 'Yes, since Java 8 interfaces support static and default methods.');

-- ✅ FLASHCARDS: Java Chapter 2 (chapter_id = 7)
INSERT INTO flashcards (chapter_id, question, answer) VALUES
(7, 'What is an exception in Java?', 'An unexpected event that disrupts program execution at runtime.'),
(7, 'What does try-catch block do?', 'Catches exceptions to prevent abnormal termination of program flow.'),
(7, 'What is the finally block?', 'Code that always executes, regardless of an exception occurring or not.'),
(7, 'Define checked vs unchecked exceptions.', 'Checked are compile-time; unchecked occur during program execution.'),
(7, 'What is a custom exception?', 'User-defined class extending Exception to handle specific application errors.'),
(7, 'How to create a thread?', 'Extend Thread class or implement Runnable interface with run() method.'),
(7, 'What does run() method do?', 'Contains code that executes when the thread starts via start() method.'),
(7, 'What is the start() method?', 'It begins execution of a new thread using run() internally.'),
(7, 'Why is synchronization needed?', 'To prevent multiple threads from accessing shared data simultaneously.'),
(7, 'What is a race condition?', 'When threads modify shared data simultaneously causing inconsistent results.'),
(7, 'What is deadlock?', 'Two threads wait indefinitely for resources held by each other.'),
(7, 'What is thread priority?', 'A hint to JVM scheduler for execution order among runnable threads.'),
(7, 'Difference between sleep and wait?', 'sleep pauses thread temporarily; wait releases lock and waits for notify.'),
(7, 'What is a daemon thread?', 'Background thread providing services to user threads in application.'),
(7, 'Purpose of join() method?', 'Waits for another thread to complete before continuing execution.');

-- ✅ FLASHCARDS: Java Chapter 3 (chapter_id = 8)
INSERT INTO flashcards (chapter_id, question, answer) VALUES
(8, 'What is a Java Applet?', 'A small program embedded in webpages executed by browser using JVM.'),
(8, 'Applet vs Java Application?', 'Applet runs in browser; application runs independently via JVM.'),
(8, 'What are AWT components?', 'UI elements like Button, Label, TextField used for graphical user interfaces.'),
(8, 'What is Event Delegation Model?', 'A design where events are handled by registered listener objects.'),
(8, 'Role of ActionListener in AWT?', 'Handles actions like button clicks using actionPerformed() method.'),
(8, 'How to register event listener?', 'Use addListener method to attach listener to a component.'),
(8, 'What is paint() method?', 'Used to render graphics in applets using a Graphics object.'),
(8, 'What is a LayoutManager?', 'Controls positioning and sizing of components in containers.'),
(8, 'List common layout managers.', 'FlowLayout, BorderLayout, GridLayout, and CardLayout manage component layout.'),
(8, 'What is FlowLayout?', 'Places components in left-to-right flow, wrapping at container’s edge.'),
(8, 'What is BorderLayout?', 'Divides container into five regions: North, South, East, West, Center.'),
(8, 'How to draw in applet?', 'Override paint() method and use Graphics class to draw.'),
(8, 'What does init() method do?', 'Initializes applet; called once when applet is loaded.'),
(8, 'How are mouse events handled?', 'Use MouseListener interface and implement event methods like mouseClicked().'),
(8, 'What is event source?', 'Object that generates events when user interacts with GUI component.');

-- ✅ FLASHCARDS: Java Chapter 4 (chapter_id = 9)
INSERT INTO flashcards (chapter_id, question, answer) VALUES
(9, 'What is Java I/O stream?', 'A stream represents flow of data for input or output operations.'),
(9, 'Difference between byte and character stream?', 'Byte handles binary data; character handles text using Unicode encoding.'),
(9, 'What is FileInputStream used for?', 'Reads raw bytes from files or other byte input sources.'),
(9, 'What is BufferedReader?', 'Efficiently reads text from character input stream using internal buffer.'),
(9, 'Purpose of FileWriter in Java?', 'Writes character data to a file, creating or overwriting its content.'),
(9, 'What is serialization in Java?', 'Process of converting object state into byte stream for storage or transmission.'),
(9, 'Which interface supports serialization?', 'java.io.Serializable allows object to be serialized for I/O.'),
(9, 'What is a socket in networking?', 'Endpoint of communication link between client and server applications.'),
(9, 'Role of ServerSocket class?', 'Listens on specific port and accepts incoming client connection requests.'),
(9, 'What is DataOutputStream?', 'Writes primitive Java data types in binary form to output stream.'),
(9, 'How to read from socket?', 'Use InputStream of socket to receive data from remote endpoint.'),
(9, 'Purpose of flush() in streams?', 'Flushes buffer contents, ensuring all data is written to output stream.'),
(9, 'Difference between TCP and UDP?', 'TCP is connection-oriented and reliable; UDP is faster but connectionless.'),
(9, 'What is URLConnection?', 'Represents active communication link between application and URL resource.'),
(9, 'Which package supports networking?', 'java.net provides classes for sockets, URLs, and IP address handling.');

-- ✅ Insert Java Chapters (subject_id = 2)
INSERT INTO chapters (subject_id, chapter_number, title) VALUES
(2, 1, 'Intro, Packages & interfaces'),
(2, 2, 'Exception Handling & Multithreading'),
(2, 3, 'Applet, Event Handling and AWT'),
(2, 4, 'Input /Output & Networking');