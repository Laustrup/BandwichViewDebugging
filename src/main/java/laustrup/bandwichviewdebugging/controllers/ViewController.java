package laustrup.bandwichviewdebugging.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin
@Controller
public class ViewController {

    private final String _index = "index.html",
                        startEndpoint = "/";

    @GetMapping(startEndpoint) public String preset() { return "redirect:" + startEndpoint + "welcome"; }
    @GetMapping(startEndpoint+"welcome") public String welcome() { return _index; }
    @GetMapping(startEndpoint+"about") public String about() { return _index; }
    @GetMapping(startEndpoint+"profile") public String profile() { return _index; }
    @GetMapping(startEndpoint+"dashboard") public String dashboard() { return _index; }
    @GetMapping(startEndpoint+"log_in") public String login() { return _index; }
    @GetMapping(startEndpoint+"sign_up") public String signup() { return _index; }
    @GetMapping(startEndpoint+"dashboard/?search_query={query}")
    public String search(@PathVariable(name = "query") String searchQuery) { return _index; }
    @GetMapping(startEndpoint+"search?chat_room={id}")
    public String chatRoom(@PathVariable(name = "id") long id) {return _index; }
    @GetMapping(startEndpoint+"search?event={id}")
    public String event(@PathVariable(name = "id") long id) { return _index; }
    @GetMapping(startEndpoint+"search?user={id}")
    public String user(@PathVariable(name = "id") long id) { return _index; }
}
