---
layout: post
title: "Optional"
date: 2019-09-03
description: "使用Optional来处理null"
tag: [Optional, null]
comments: true
---
## 什么是Optional
引用jdk中的描述
>A container object which may or may not contain a non-null value.
If a value is present, {@code isPresent()} will return {@code true} and
{@code get()} will return the value.
一个可以存放null或者不是null值的容器，如果值存在，isPresent()将返回true并且get()将返回这个值

## 常用方法的用法
### ofNullable()
```java
/**
 * Returns an {@code Optional} describing the specified value, if non-null,
 * otherwise returns an empty {@code Optional}.
 *
 * 返回一个Optional描述的值，不为null，否则返回一个空Optional
 *
 * @param <T> the class of the value
 * @param value the possibly-null value to describe
 * @return an {@code Optional} with a present value if the specified value
 * is non-null, otherwise an empty {@code Optional}
 */
public static <T> Optional<T> ofNullable(T value) {
    return value == null ? empty() : of(value);
}
```
```java
//不使用Optional
public static String getGender(Student student)
{
    if(null == student) {
         return "Unkown";
    }
    return student.getGender();
}
//使用Optional
public static String getGender(Student student) {
       return Optional.ofNullable(student).map(u -> u.getGender()).orElse("Unkown");    
}
```


### ifPresent()
```java
/**
 * Return {@code true} if there is a value present, otherwise {@code false}.
 *
 * 判断Optional包装的对象是否为null，不为null返回true,null返回false
 *
 * @return {@code true} if there is a value present, otherwise {@code false}
 */
public boolean isPresent() {
    return value != null;
}
```
```java
public static void printName(Student student){
    Optional.ofNullable(student).ifPresent(u ->  System.out.println("The student name is : " + u.getName()));
}
```

### filter()
```java
/**
 * If a value is present, and the value matches the given predicate,
 * return an {@code Optional} describing the value, otherwise return an
 * empty {@code Optional}.
 *
 *参数为Predicate对象，用于对Optional对象进行过滤，如果符合Predicate的条件，返回Optional对象本身，否则返回一个空的Optional对象
 *
 * @param predicate a predicate to apply to the value, if present
 * @return an {@code Optional} describing the value of this {@code Optional}
 * if a value is present and the value matches the given predicate,
 * otherwise an empty {@code Optional}
 * @throws NullPointerException if the predicate is null
 */
public Optional<T> filter(Predicate<? super T> predicate) {
    Objects.requireNonNull(predicate);
    if (!isPresent())
        return this;
    else
        return predicate.test(value) ? this : empty();
}
```
```java
public static void filterAge(Student student) {
    Optional.ofNullable(student).filter( u -> u.getAge() > 18).ifPresent(u ->  System.out.println("The student age is more than 18."));
}
```

### map()
```java
/**
    * If a value is present, apply the provided mapping function to it,
    * and if the result is non-null, return an {@code Optional} describing the
    * result.  Otherwise return an empty {@code Optional}.
    *
    * @apiNote This method supports post-processing on optional values, without
    * the need to explicitly check for a return status.  For example, the
    * following code traverses a stream of file names, selects one that has
    * not yet been processed, and then opens that file, returning an
    * {@code Optional<FileInputStream>}:
    *
    *参数为Function（函数式接口）对象，map()方法将Optional中的包装对象用Function函数
    * 进行运算，并包装成新的Optional对象(包装对象的类型可能改变)
    *
    * <pre>{@code
    *     Optional<FileInputStream> fis =
    *         names.stream().filter(name -> !isProcessedYet(name))
    *                       .findFirst()
    *                       .map(name -> new FileInputStream(name));
    * }</pre>
    *
    * Here, {@code findFirst} returns an {@code Optional<String>}, and then
    * {@code map} returns an {@code Optional<FileInputStream>} for the desired
    * file if one exists.
    *
    * @param <U> The type of the result of the mapping function
    * @param mapper a mapping function to apply to the value, if present
    * @return an {@code Optional} describing the result of applying a mapping
    * function to the value of this {@code Optional}, if a value is present,
    * otherwise an empty {@code Optional}
    * @throws NullPointerException if the mapping function is null
    */
public<U> Optional<U> map(Function<? super T, ? extends U> mapper) {
    Objects.requireNonNull(mapper);
    if (!isPresent())
       return empty();
    else {
        return Optional.ofNullable(mapper.apply(value));
    }
}
```
```java
//如果names.stream()不为空并且已经加载完毕，返回一个Optional<FileInputStream>
Optional<FileInputStream> fis =
    names.stream().filter(name -> !isProcessedYet(name))
                     .findFirst()
                     .map(name -> new FileInputStream(name));
}
```

### flatMap()
```java
/**
 * If a value is present, apply the provided {@code Optional}-bearing
 * mapping function to it, return that result, otherwise return an empty
 * {@code Optional}.  This method is similar to {@link #map(Function)},
 * but the provided mapper is one whose result is already an {@code Optional},
 * and if invoked, {@code flatMap} does not wrap it with an additional
 * {@code Optional}.
 *
 * @param <U> The type parameter to the {@code Optional} returned by
 * @param mapper a mapping function to apply to the value, if present
 *           the mapping function
 * @return the result of applying an {@code Optional}-bearing mapping
 * function to the value of this {@code Optional}, if a value is present,
 * otherwise an empty {@code Optional}
 * @throws NullPointerException if the mapping function is null or returns
 * a null result
 */
public<U> Optional<U> flatMap(Function<? super T, Optional<U>> mapper) {
    Objects.requireNonNull(mapper);
    if (!isPresent())
        return empty();
    else {
        return Objects.requireNonNull(mapper.apply(value));
    }
}
```
```java
public static Optional<Integer> getAge(Student student) {
     return Optional.ofNullable(student).flatMap(u -> Optional.ofNullable(u.getAge()));
}
```

### orElse()
```java
/**
 * Return the value if present, otherwise return {@code other}.
 *
 * 如果存在值则返回，否则返回other
 *
 * @param other the value to be returned if there is no value present, may
 * be null
 * @return the value, if present, otherwise {@code other}
 */
public T orElse(T other) {
    return value != null ? value : other;
}
```

### orElseGet()
```java
/**
 * Return the value if present, otherwise invoke {@code other} and return
 * the result of that invocation.
 *
 * 如果存在值则返回，否则调用other作为返回值
 *
 * @param other a {@code Supplier} whose result is returned if no value
 * is present
 * @return the value if present otherwise the result of {@code other.get()}
 * @throws NullPointerException if value is not present and {@code other} is
 * null
 */
public T orElseGet(Supplier<? extends T> other) {
    return value != null ? value : other.get();
}
```

### orElseThrow()
```java
/**
 * Return the contained value, if present, otherwise throw an exception
 * to be created by the provided supplier.
 *
 * 如果存在值则返回，否则抛出一个supplier创建的异常
 *
 * @apiNote A method reference to the exception constructor with an empty
 * argument list can be used as the supplier. For example,
 * {@code IllegalStateException::new}
 *
 * @param <X> Type of the exception to be thrown
 * @param exceptionSupplier The supplier which will return the exception to
 * be thrown
 * @return the present value
 * @throws X if there is no value present
 * @throws NullPointerException if no value is present and
 * {@code exceptionSupplier} is null
 */
public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X {
    if (value != null) {
        return value;
    } else {
        throw exceptionSupplier.get();
    }
}
```
