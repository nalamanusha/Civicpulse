class A 
{ 
public void OverrideMethod() 
{ 
System.out.println("Super class method"); 
} 
} 
class B extends A 
{ 
public void OverrideMethod() 
{ 
System.out.println("Sub class B's Overridden Method"); 
} 
} 
class C extends A 
{ 
public void OverrideMethod() 
{ 
System.out.println("Sub class C's Overridden Method"); 
} 
} 
public class ABC 
{ 
public static void main(String args[]) 
{ 
A o; 
A obj1 = new A(); 
B obj2 = new B(); 
C obj3 = new C(); 
o=obj1; 
o.OverrideMethod(); //calling super class method 
9 
o=obj2; 
o.OverrideMethod(); //calling A method from subclass object 
o=obj3; 
o.OverrideMethod(); //calling A method from subclass object 
} 
} 
