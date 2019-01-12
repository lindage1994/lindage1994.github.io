---
layout: post
title: "spring注解分析"
date: 2019-01-05
description: "spring常用注解"
tag: spring
---

>Spring中的注解大概可以分为两大类：

- spring的bean容器相关的注解，或者说bean工厂相关的注解；
- springmvc相关的注解。


spring的bean容器相关的注解，@Required， @Autowired, @PostConstruct,@PreDestory，还有Spring3.0开始支持的JSR-330标准javax.inject.*中的注解(@Inject, @Named, @Qualifier, @Provider, @Scope, @Singleton).

springmvc相关的注解有：@Controller, @RequestMapping, @RequestParam， @ResponseBody等等。

>@Required

用在set方法上，一旦用了这个注解，那么容器在初始化bean的时候必须要进行set，也就是说必须对这个值进行依赖注入。

>@AutoWired

注解是按照类型（byType）装配依赖对象，默认情况下它要求依赖对象必须存在，如果允许null值，可以设置它的required属性为false。如果我们想使用按照名称（byName）来装配，可以结合@Qualifier注解一起使用。如下：
```
public class UserServiceImpl {
    @Autowired(required = false)
    @Qualifier("userMapper")
    private UserMapper userMapper;
}
```
>@Resource

默认按照ByName自动注入，由J2EE提供，需要导入包javax.annotation.Resource。@Resource有两个重要的属性：name和type，而Spring将@Resource注解的name属性解析为bean的名字，而type属性则解析为bean的类型。所以，如果使用name属性，则使用byName的自动注入策略，而使用type属性时则使用byType自动注入策略。如果既不制定name也不制定type属性，这时将通过反射机制使用byName自动注入策略。

```
public class UserServiceImpl {
    // 下面两种@Resource只要使用一种即可
    @Resource(name="userMapper")
    private UserMapper userMapper; // 用于属性

    @Resource(name="userMapper")
    public void setUserMapper(UserMapper userMapper) { // 用于属性的setter方法上
        this.userMapper = userMapper;
    }
}
```
@Resource装配顺序：
1. 如果同时指定了name和type，则从Spring上下文中找到唯一匹配的bean进行装配，找不到则抛出异常。
1.  如果指定了name，则从上下文中查找名称（id）匹配的bean进行装配，找不到则抛出异常。
1. 如果指定了type，则从上下文中找到类似匹配的唯一bean进行装配，找不到或是找到多个，都会抛出异常。
1. 如果既没有指定name，又没有指定type，则自动按照byName方式进行装配；如果没有匹配，则回退为一个原始类型进行匹配，如果匹配则自动装配。

@Resource的作用相当于@Autowired，只不过@Autowired按照byType自动注入。

>@Qualifier

限定描述符，用于细粒度选择候选者；

```
@Component
@Qualifier("xxxxxRemote")
public class HelloRemoteHystrix implements HelloRemote {
    @Override
    public String hello(@RequestParam(value = "name") String name) {
        return "hello" + name + ". this message send failed";
    }
    @Override
    public String getUser(@PathVariable(value = "id") String id) {
        return null;
    }
}

@RestController
public class ConsumerController {

    @Autowired(required = false)
    @Qualifier("xxxxxRemote")
    private HelloRemote helloRemote;

    @RequestMapping("/hello/{name}")
    public String index(@PathVariable("name") String name) {
        return helloRemote.hello(name);
    }
    @RequestMapping("/user/{id}")
    public String getUser(@PathVariable("id") String id){
        return helloRemote.getUser(id);
    }

}
```
@Component

@Component是所有受Spring 管理组件的通用形式，@Component注解可以放在类的头上，@Component不推荐使用。

@Controller


```
@Controller
@Scope("prototype")
public class UserController extends BaseController{
 ……
}
```

@Controller对应表现层的Bean，也就是Action
使用@Controller注解标识UserAction之后，就表示要把UserAction交给Spring容器管理，在Spring容器中会存在一个名字为"userAction"的action，这个名字是根据UserController类名来取的。注意：如果@Controller不指定其value，则默认的bean名字为这个类的类名首字母小写，如果指定value[@Controller(value="UserController")]，则使用value作为bean的名字。

这里的UserController还使用了@Scope注解，@Scope("prototype")表示将Controller的范围声明为原型，可以利用容器的scope="prototype"来保证每一个请求有一个单独的Controller来处理。spring 默认scope是单例模式(scope="singleton")，这样只会创建一个Controller对象，每次访问都是同一Controller对象，数据不安全，scope="prototype" 可以保证当有请求的时候都创建一个Action对象。

>@Service

@Service对应的是业务层Bean，例如：

```
@Service("userService")
public class UserServiceImpl implements UserService {
………
}
```
注意：在Action声明的"userService"变量的类型必须是"UserServiceImpl"或者是其父类"UserService"，否则由于类型不一致而无法注入。Action要使用UserServiceImpl时，就不用主动去创建UserServiceImpl的实例了，创建UserServiceImpl实例已经交给Spring来做了，Spring把创建好的UserServiceImpl实例给Action，Action拿到就可以直接用了。Action由原来的主动创建UserServiceImpl实例后就可以马上使用，变成了被动等待由Spring创建好UserServiceImpl实例之后再注入给Action，Action才能够使用。这说明Action对"UserServiceImpl"类的“控制权”已经被“反转”了，原来主动权在自己手上，自己要使用"UserServiceImpl"类的实例，自己主动去new一个出来马上就可以使用了，但现在自己不能主动去new "UserServiceImpl"类的实例，new "UserServiceImpl"类的实例的权力已经被Spring拿走了，只有Spring才能够new "UserServiceImpl"类的实例，而Action只能等Spring创建好"UserServiceImpl"类的实例后，再“恳求”Spring把创建好的"UserServiceImpl"类的实例给他，这样他才能够使用"UserServiceImpl"，这就是Spring核心思想“控制反转”，也叫“依赖注入”，“依赖注入”也很好理解，Action需要使用UserServiceImpl干活，那么就是对UserServiceImpl产生了依赖，Spring把Acion需要依赖的UserServiceImpl注入(也就是“给”)给Action，这就是所谓的“依赖注入”。对Action而言，Action依赖什么东西，就请求Spring注入给他，对Spring而言，Action需要什么，Spring就主动注入给他。

>@Repository

@Repository对应数据访问层Bean

```
@Repository(value="userDao")
public class UserDaoImpl extends BaseDaoImpl<User> {
………
}
```
使用注解之前要开启自动扫描功能，其中base-package为需要扫描的包(含子包)。

```
<context:component-scan base-package="cn.test"/>
```

@Configuration把一个类作为一个IoC容器，它的某个方法头上如果注册了@Bean，就会作为这个Spring容器中的Bean。
- @Scope注解 作用域
- @Lazy(true) 表示延迟初始化
- @Service用于标注业务层组件、
- @Controller用于标注控制层组件（如struts中的action）
- @Repository用于标注数据访问组件，即DAO组件。
- @Component泛指组件，当组件不好归类的时候，我们可以使用这个注解进行标注。
- @Scope用于指定scope作用域的（用在类上）
- @PostConstruct用于指定初始化方法（用在方法上）
- @PreDestory用于指定销毁方法（用在方法上）
- @DependsOn：定义Bean初始化及销毁时的顺序
- @Primary：自动装配时当出现多个Bean候选者时，被注解为@Primary的Bean将作为首选者，否则将抛出异常
- @Autowired 默认按类型装配，如果我们想使用按名称装配，可以结合@Qualifier注解一起使用。如下：
- @Autowired @Qualifier("personDaoBean") 存在多个实例配合使用
- @Resource默认按名称装配，当找不到与名称匹配的bean才会按类型装配。
- @PostConstruct 初始化注解
- @PreDestroy 摧毁注解 默认 单例  启动就加载
- @Async异步方法调用

> 在SpringMVC 中，控制器Controller 负责处理由DispatcherServlet 分发的请求，它把用户请求的数据经过业务处理层处理之后封装成一个Model ，然后再把该Model 返回给对应的View 进行展示。在SpringMVC 中提供了一个非常简便的定义Controller 的方法，你无需继承特定的类或实现特定的接口，只需使用@Controller 标记一个类是Controller ，然后使用@RequestMapping 和@RequestParam 等一些注解用以定义URL 请求和Controller 方法之间的映射，这样的Controller 就能被外界访问到。此外Controller 不会直接依赖于HttpServletRequest 和HttpServletResponse 等HttpServlet 对象，它们可以通过Controller 的方法参数灵活的获取到。


>@RequestMapping

- 使用URI模板

URI 模板就是在URI 中给定一个变量，然后在映射的时候动态的给该变量赋值。

```
@Controller
@RequestMapping ( "/test/{variable1}" )
public class MyController {

    @RequestMapping ( "/showView/{variable2}" )
    public ModelAndView showView( @PathVariable String variable1, @PathVariable ( "variable2" ) int variable2) {
       ModelAndView modelAndView = new ModelAndView();
       modelAndView.setViewName( "viewName" );
       modelAndView.addObject( " 需要放到 model 中的属性名称 " , " 对应的属性值，它是一个对象 " );
       return modelAndView;
    }
}
```
   除了在请求路径中使用URI 模板，定义变量之外，@RequestMapping 中还支持通配符“* ”。如下面的代码我就可以使用/myTest/whatever/wildcard 访问到Controller 的testWildcard 方法。

```
@Controller
@RequestMapping ( "/myTest" )
public class MyController {
    @RequestMapping ( "*/wildcard" )
    public String testWildcard() {
       System. out .println( "wildcard------------" );
       return "wildcard" ;
    }  
}
```

- 使用 @RequestParam 绑定 HttpServletRequest 请求参数到控制器方法参数

```
@RequestMapping ( "requestParam" )
   public String testRequestParam( @RequestParam(required=false) String name, @RequestParam ( "age" ) int age) {
       return "requestParam" ;
    }
```
在上面代码中利用@RequestParam 从HttpServletRequest 中绑定了参数name 到控制器方法参数name ，绑定了参数age 到控制器方法参数age 。值得注意的是和@PathVariable 一样，当你没有明确指定从request 中取哪个参数时，Spring 在代码是debug 编译的情况下会默认取更方法参数同名的参数，如果不是debug 编译的就会报错。此外，当需要从request 中绑定的参数和方法的参数名不相同的时候，也需要在@RequestParam 中明确指出是要绑定哪个参数。在上面的代码中如果我访问/requestParam.do?name=hello&age=1 则Spring 将会把request请求参数name 的值hello 赋给对应的处理方法参数name ，把参数age 的值1 赋给对应的处理方法参数age 。

在@RequestParam 中除了指定绑定哪个参数的属性value 之外，还有一个属性required ，它表示所指定的参数是否必须在request 属性中存在，默认是true ，表示必须存在，当不存在时就会报错。在上面代码中我们指定了参数name 的required 的属性为false ，而没有指定age 的required 属性，这时候如果我们访问/requestParam.do而没有传递参数的时候，系统就会抛出异常，因为age 参数是必须存在的，而我们没有指定。而如果我们访问/requestParam.do?age=1 的时候就可以正常访问，因为我们传递了必须的参数age ，而参数name 是非必须的，不传递也可以。
（三）使用 @CookieValue 绑定 cookie 的值到 Controller 方法参数
例5

    @RequestMapping ( "cookieValue" )
    public String testCookieValue( @CookieValue ( "hello" ) String cookieValue, @CookieValue String hello) {
       System. out .println(cookieValue + "-----------" + hello);
       return "cookieValue" ;
    }
在上面的代码中我们使用@CookieValue 绑定了cookie 的值到方法参数上。上面一共绑定了两个参数，一个是明确指定要绑定的是名称为hello 的cookie 的值，一个是没有指定。使用没有指定的形式的规则和@PathVariable、@RequestParam 的规则是一样的，即在debug 编译模式下将自动获取跟方法参数名同名的cookie 值。

（四）使用 @RequestHeader 注解绑定 HttpServletRequest 头信息到Controller 方法参数
例6

@RequestMapping ( "testRequestHeader" )
public String testRequestHeader( @RequestHeader ( "Host" ) String hostAddr, @RequestHeader String Host, @RequestHeader String host ) {
    System. out .println(hostAddr + "-----" + Host + "-----" + host );
    return "requestHeader" ;
}
在上面的代码中我们使用了 @RequestHeader 绑定了 HttpServletRequest 请求头 host 到Controller 的方法参数。上面方法的三个参数都将会赋予同一个值，由此我们可以知道在绑定请求头参数到方法参数的时候规则和 @PathVariable 、 @RequestParam 以及 @CookieValue 是一样的，即没有指定绑定哪个参数到方法参数的时候，在 debug 编译模式下将使用方法参数名作为需要绑定的参数。但是有一点 @RequestHeader 跟另外三种绑定方式是不一样的，那就是在使用 @RequestHeader 的时候是大小写不敏感的，即 @RequestHeader(“Host”) 和 @RequestHeader(“host”) 绑定的都是 Host 头信息。记住在 @PathVariable 、 @RequestParam 和 @CookieValue 中都是大小写敏感的。

（五） @RequestMapping 的一些高级应用
在RequestMapping 中除了指定请求路径value 属性外，还有其他的属性可以指定，如params 、method 和headers 。这样属性都可以用于缩小请求的映射范围。

1.params属性
例7

    @RequestMapping (value= "testParams" , params={ "param1=value1" , "param2" , "!param3" })
    public String testParams() {
       System. out .println( "test Params..........." );
       return "testParams" ;
    }
在上面的代码中我们用@RequestMapping 的params 属性指定了三个参数，这些参数都是针对请求参数而言的，它们分别表示参数param1 的值必须等于value1 ，参数param2 必须存在，值无所谓，参数param3 必须不存在，只有当请求/testParams.do 并且满足指定的三个参数条件的时候才能访问到该方法。所以当请求/testParams.do?param1=value1&param2=value2 的时候能够正确访问到该testParams 方法，当请求/testParams.do?param1=value1&param2=value2&param3=value3 的时候就不能够正常的访问到该方法，因为在@RequestMapping 的params 参数里面指定了参数param3 是不能存在的。

2.method属性
例8

    @RequestMapping (value= "testMethod" , method={RequestMethod. GET , RequestMethod. DELETE })
    public String testMethod() {
       return "method" ;
    }
在上面的代码中就使用method 参数限制了以GET 或DELETE 方法请求/testMethod.do 的时候才能访问到该Controller 的testMethod 方法。

3.headers属性
例9


```
@RequestMapping (value= "testHeaders" , headers={ "host=localhost" , "Accept" })
    public String testHeaders() {
       return "headers" ;
    }
```

headers 属性的用法和功能与params 属性相似。在上面的代码中当请求/testHeaders.do 的时候只有当请求头包含Accept 信息，且请求的host 为localhost 的时候才能正确的访问到testHeaders 方法。

（六）以 @RequestMapping 标记的处理器方法支持的方法参数和返回类型

1. 支持的方法参数类型
-  HttpServlet 对象，主要包括HttpServletRequest 、HttpServletResponse 和HttpSession 对象。 这些参数Spring 在调用处理器方法的时候会自动给它们赋值，所以当在处理器方法中需要使用到这些对象的时候，可以直接在方法上给定一个方法参数的申明，然后在方法体里面直接用就可以了。但是有一点需要注意的是在使用HttpSession 对象的时候，如果此时HttpSession 对象还没有建立起来的话就会有问题。
- Spring 自己的WebRequest 对象。 使用该对象可以访问到存放在HttpServletRequest 和HttpSession 中的属性值。
- InputStream 、OutputStream 、Reader 和Writer 。 InputStream 和Reader 是针对HttpServletRequest 而言的，可以从里面取数据；OutputStream 和Writer 是针对HttpServletResponse 而言的，可以往里面写数据。
- 使用@PathVariable 、@RequestParam 、@CookieValue 和@RequestHeader 标记的参数。
- 使用@ModelAttribute 标记的参数。
- java.util.Map 、Spring 封装的Model 和ModelMap 。 这些都可以用来封装模型数据，用来给视图做展示。
- 实体类。 可以用来接收上传的参数。
- Spring 封装的MultipartFile 。 用来接收上传文件的。
- Spring 封装的Errors 和BindingResult 对象。 这两个对象参数必须紧接在需要验证的实体对象参数之后，它里面包含了实体对象的验证结果。
2. 支持的返回类型
- 一个包含模型和视图的ModelAndView 对象。
- 一个模型对象，这主要包括Spring 封装好的Model和ModelMap ，以及java.util.Map ，当没有视图返回的时候视图名称将由RequestToViewNameTranslator 来决定。
- 一个View 对象。这个时候如果在渲染视图的过程中模型的话就可以给处理器方法定义一个模型参数，然后在方法体里面往模型中添加值。
- 一个String 字符串。这往往代表的是一个视图名称。这个时候如果需要在渲染视图的过程中需要模型的话就可以给处理器方法一个模型参数，然后在方法体里面往模型中添加值就可以了。
- 返回值是void 。这种情况一般是我们直接把返回结果写到HttpServletResponse 中了，如果没有写的话，那么Spring 将会利用RequestToViewNameTranslator 来返回一个对应的视图名称。如果视图中需要模型的话，处理方法与返回字符串的情况相同。
- 如果处理器方法被注解@ResponseBody 标记的话，那么处理器方法的任何返回类型都会通过HttpMessageConverters 转换之后写到HttpServletResponse 中，而不会像上面的那些情况一样当做视图或者模型来处理。
- 除以上几种情况之外的其他任何返回类型都会被当做模型中的一个属性来处理，而返回的视图还是由RequestToViewNameTranslator 来决定，添加到模型中的属性名称可以在该方法上用@ModelAttribute(“attributeName”) 来定义，否则将使用返回类型的类名称的首字母小写形式来表示。使用@ModelAttribute 标记的方法会在@RequestMapping 标记的方法执行之前执行。
- 使用 @ModelAttribute 和 @SessionAttributes 传递和保存数据
SpringMVC 支持使用 @ModelAttribute 和 @SessionAttributes 在不同的模型和控制器之间共享数据。 @ModelAttribute 主要有两种使用方式，一种是标注在方法上，一种是标注在 Controller 方法参数上。

当 @ModelAttribute 标记在方法上的时候，该方法将在处理器方法执行之前执行，然后把返回的对象存放在 session 或模型属性中，属性名称可以使用 @ModelAttribute(“attributeName”) 在标记方法的时候指定，若未指定，则使用返回类型的类名称（首字母小写）作为属性名称。关于 @ModelAttribute 标记在方法上时对应的属性是存放在 session 中还是存放在模型中，我们来做一个实验，看下面一段代码。


```
@Controller
@RequestMapping ( "/myTest" )
public class MyController {

    @ModelAttribute ( "hello" )
    public String getModel() {
       System. out .println( "-------------Hello---------" );
       return "world" ;
    }

    @ModelAttribute ( "intValue" )
    public int getInteger() {
       System. out .println( "-------------intValue---------------" );
       return 10;
    }

    @RequestMapping ( "sayHello" )
    public void sayHello( @ModelAttribute ( "hello" ) String hello, @ModelAttribute ( "intValue" ) int num, @ModelAttribute ( "user2" ) User user, Writer writer, HttpSession session) throws IOException {
       writer.write( "Hello " + hello + " , Hello " + user.getUsername() + num);
       writer.write( "\r" );
       Enumeration enume = session.getAttributeNames();
       while (enume.hasMoreElements())
           writer.write(enume.nextElement() + "\r" );
    }

    @ModelAttribute ( "user2" )
    public User getUser() {
       System. out .println( "---------getUser-------------" );
       return new User(3, "user2" );
    }
}
```

当我们请求 /myTest/sayHello.do 的时候使用 @ModelAttribute 标记的方法会先执行，然后把它们返回的对象存放到模型中。最终访问到 sayHello 方法的时候，使用 @ModelAttribute 标记的方法参数都能被正确的注入值。执行结果如下所示：

 Hello world,Hello user210

  由执行结果我们可以看出来，此时 session 中没有包含任何属性，也就是说上面的那些对象都是存放在模型属性中，而不是存放在 session 属性中。那要如何才能存放在 session 属性中呢？这个时候我们先引入一个新的概念 @SessionAttributes ，它的用法会在讲完 @ModelAttribute 之后介绍，这里我们就先拿来用一下。我们在 MyController 类上加上 @SessionAttributes 属性标记哪些是需要存放到 session 中的。看下面的代码：


```
@Controller
@RequestMapping ( "/myTest" )
@SessionAttributes (value={ "intValue" , "stringValue" }, types={User. class })
public class MyController {

    @ModelAttribute ( "hello" )
    public String getModel() {
       System. out .println( "-------------Hello---------" );
       return "world" ;
    }

    @ModelAttribute ( "intValue" )
    public int getInteger() {
       System. out .println( "-------------intValue---------------" );
       return 10;
    }

    @RequestMapping ( "sayHello" )
    public void sayHello(Map<String, Object> map, @ModelAttribute ( "hello" ) String hello, @ModelAttribute ( "intValue" ) int num, @ModelAttribute ( "user2" ) User user, Writer writer, HttpServletRequest request) throws IOException {
       map.put( "stringValue" , "String" );
       writer.write( "Hello " + hello + " , Hello " + user.getUsername() + num);
       writer.write( "\r" );
       HttpSession session = request.getSession();
       Enumeration enume = session.getAttributeNames();
       while (enume.hasMoreElements())
           writer.write(enume.nextElement() + "\r" );
       System. out .println(session);
    }

    @ModelAttribute ( "user2" )
    public User getUser() {
       System. out .println( "---------getUser-------------" );
       return new User(3, "user2" );
    }
}
```

在上面代码中我们指定了属性为 intValue 或 stringValue 或者类型为 User 的都会放到 Session中，利用上面的代码当我们访问 /myTest/sayHello.do 的时候，结果如下：

 Hello world,Hello user210

仍然没有打印出任何 session 属性，这是怎么回事呢？怎么定义了把模型中属性名为 intValue 的对象和类型为 User 的对象存到 session 中，而实际上没有加进去呢？难道我们错啦？我们当然没有错，只是在第一次访问 /myTest/sayHello.do 的时候 @SessionAttributes 定义了需要存放到 session 中的属性，而且这个模型中也有对应的属性，但是这个时候还没有加到 session 中，所以 session 中不会有任何属性，等处理器方法执行完成后 Spring 才会把模型中对应的属性添加到 session 中。所以当请求第二次的时候就会出现如下结果：

 Hello world,Hello user210

user2

intValue

stringValue

当 @ModelAttribute 标记在处理器方法参数上的时候，表示该参数的值将从模型或者 Session 中取对应名称的属性值，该名称可以通过 @ModelAttribute(“attributeName”) 来指定，若未指定，则使用参数类型的类名称（首字母小写）作为属性名称。
