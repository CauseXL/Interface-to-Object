# Turn Typescript Interface to Javascript Object

## Only support Interface

``` typescript

// some interface definition you have
interface TEST {
  name: string;
  age: number;
  dislike: ["test", "test2"];
  like: string[] | number[];
  info: TEST;
  more: {
    name: string;
    age: number;
    like: string[] | number[];
    test: {
      name: string;
      age: number;
      like: string[] | number[];
    };
  };
};

// this plugin will generate it to javascript object with initial default value
const test = {name: "",age: 0,dislike: [],like: [],info: {},more: {
    name: string;
    age: number;
    like: string[] | number[];
    test: {
      name: string;
      age: number;
      like: string[] | number[];
    };
  },}
```

## How to use

- simply select your interface code

![image](https://user-images.githubusercontent.com/17822243/172056597-28de4cd6-cd0a-4bae-a636-74ef39ba4ea0.png)

- right click
- choose [Turn Typescript Interface to Javascript Object] command in the context menu

![image](https://user-images.githubusercontent.com/17822243/172056546-7c3079d4-4ec3-43e3-9204-e32c95dfc958.png)
- That's it! 
## TODO

- interface / type in interface

## License

[MIT](./LICENSE) License © 2022
