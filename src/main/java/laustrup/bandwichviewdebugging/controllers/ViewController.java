package laustrup.bandwichviewdebugging.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin
@Controller
public class ViewController {

    private final String _index = "index.html";

    @GetMapping("/") public String preset() { return "redirect:/welcome"; }
    @GetMapping("/welcome") public String welcome() { return _index; }
    @GetMapping("/about") public String about() { return _index; }
    @GetMapping("/profile") public String profile() { return _index; }
    @GetMapping("/dashboard") public String dashboard() { return _index; }
    @GetMapping("/log_in") public String login() { return _index; }
    @GetMapping("/sign_up") public String signup() { return _index; }
    @GetMapping("/dashboard/?search_query={query}")
    public String search(@PathVariable(name = "query") String searchQuery) { return _index; }
    @GetMapping("/?chat_room={id}")
    public String chatRoom(@PathVariable(name = "id") long id) {return _index; }
    @GetMapping("/?event={id}")
    public String event(@PathVariable(name = "id") long id) { return _index; }
    @GetMapping("/?user={id}")
    public String user(@PathVariable(name = "id") long id) { return _index; }
}
