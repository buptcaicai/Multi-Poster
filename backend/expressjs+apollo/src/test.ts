// src/index.ts
import 'reflect-metadata'; // Must be the very first import!

// ----------------------------------------------------
// Define a simple decorator for testing
function MyDecorator(target: any, propertyKey: string | symbol) {
    // This decorator does nothing but allows metadata to be emitted
}

// Define a custom type (should also be a class for better reflection)
class MyCustomType {
    name!: string;
    value!: number;
}

// Define a class with properties using the decorator
class TestClass {
    @MyDecorator
    public myStringProp!: string;

    @MyDecorator
    public myNumberProp!: number;

    @MyDecorator
    public myBooleanProp!: boolean;

    @MyDecorator
    public myDateProp!: Date;

    @MyDecorator
    public myCustomObjectProp!: MyCustomType;

    @MyDecorator
    public myStringArrayProp!: string[];

    @MyDecorator
    public myCustomTypeArrayProp!: MyCustomType[];
}

// ----------------------------------------------------


// --- Test Logic ---
function testDecoratorMetadata() {
    console.log('--- Testing Decorator Metadata ---');

    const testInstance = new TestClass(); // Instantiate the class (though not strictly necessary for reflection)

    // Property 1: myStringProp (expected type: String)
    const stringPropType = Reflect.getMetadata('design:type', TestClass.prototype, 'myStringProp');
    console.log(`myStringProp: Expected=String, Found=${stringPropType && stringPropType.name}`);
    console.assert(stringPropType === String, 'myStringProp type mismatch');

    // Property 2: myNumberProp (expected type: Number)
    const numberPropType = Reflect.getMetadata('design:type', TestClass.prototype, 'myNumberProp');
    console.log(`myNumberProp: Expected=Number, Found=${numberPropType && numberPropType.name}`);
    console.assert(numberPropType === Number, 'myNumberProp type mismatch');

    // Property 3: myBooleanProp (expected type: Boolean)
    const booleanPropType = Reflect.getMetadata('design:type', TestClass.prototype, 'myBooleanProp');
    console.log(`myBooleanProp: Expected=Boolean, Found=${booleanPropType && booleanPropType.name}`);
    console.assert(booleanPropType === Boolean, 'myBooleanProp type mismatch');

    // Property 4: myDateProp (expected type: Date)
    const datePropType = Reflect.getMetadata('design:type', TestClass.prototype, 'myDateProp');
    console.log(`myDateProp: Expected=Date, Found=${datePropType && datePropType.name}`);
    console.assert(datePropType === Date, 'myDateProp type mismatch');

    // Property 5: myCustomObjectProp (expected type: MyCustomType)
    const customObjectPropType = Reflect.getMetadata('design:type', TestClass.prototype, 'myCustomObjectProp');
    console.log(`myCustomObjectProp: Expected=MyCustomType, Found=${customObjectPropType && customObjectPropType.name}`);
    console.assert(customObjectPropType === MyCustomType, 'myCustomObjectProp type mismatch');


    // Property 6: myStringArrayProp (expected type: Array)
    // NOTE: For arrays, `design:type` metadata will typically be `Array`.
    // It *doesn't* tell you the type of the elements *within* the array (e.g., String).
    // This is a common point of confusion. Libraries like Typegoose/TypeGraphQL use other decorators
    // (like @prop({ type: () => [String] })) to get this specific element type.
    const stringArrayPropType = Reflect.getMetadata('design:type', TestClass.prototype, 'myStringArrayProp');
    console.log(`myStringArrayProp: Expected=Array, Found=${stringArrayPropType && stringArrayPropType.name}`);
    console.assert(stringArrayPropType === Array, 'myStringArrayProp type mismatch');


    // Property 7: myCustomTypeArrayProp (expected type: Array)
    // Same as above, `design:type` will be `Array`, not `MyCustomType[]`
    const customTypeArrayPropType = Reflect.getMetadata('design:type', TestClass.prototype, 'myCustomTypeArrayProp');
    console.log(`myCustomTypeArrayProp: Expected=Array, Found=${customTypeArrayPropType && customTypeArrayPropType.name}`);
    console.assert(customTypeArrayPropType === Array, 'myCustomTypeArrayProp type mismatch');


    console.log('--- Decorator Metadata Test Complete ---');
}

// Call the test function
testDecoratorMetadata();
