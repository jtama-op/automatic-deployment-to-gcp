package com.groupeonepoint.gcp.resource;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/hello")
public class HelloGCPResource {

    @GET
    @Produces(MediaType.TEXT_HTML)
    public String hello() {
        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                    "<head>" +
                        "<meta charset=\"utf-8\">" +
                        "<title>Automatic deployment to GCP</title>" +
                    "</head>" +
                    "<body>" +
                        "<h1>Hello from GCP!!</h1>" +
                    "</body>" +
                "</html>";
    }
}