package com.gestao.eventos.specification;

import com.gestao.eventos.entity.Event;
import net.kaczmarzyk.spring.data.jpa.domain.Equal;
import net.kaczmarzyk.spring.data.jpa.domain.GreaterThanOrEqual;
import net.kaczmarzyk.spring.data.jpa.domain.LikeIgnoreCase;
import net.kaczmarzyk.spring.data.jpa.domain.LessThanOrEqual;
import net.kaczmarzyk.spring.data.jpa.web.annotation.And;
import net.kaczmarzyk.spring.data.jpa.web.annotation.Spec;
import org.springframework.data.jpa.domain.Specification;

public class EventSpec {

    @And({
            @Spec(path = "title", spec = LikeIgnoreCase.class),
            @Spec(path = "location", spec = LikeIgnoreCase.class),
            @Spec(path = "eventDate", params = "dateFrom", spec = GreaterThanOrEqual.class, config = "yyyy-MM-dd'T'HH:mm:ss"),
            @Spec(path = "eventDate", params = "dateTo", spec = LessThanOrEqual.class, config = "yyyy-MM-dd'T'HH:mm:ss"),
            @Spec(path = "deleted", spec = Equal.class, constVal = "false")
    })
    public interface EventFilter extends Specification<Event> {}
}
