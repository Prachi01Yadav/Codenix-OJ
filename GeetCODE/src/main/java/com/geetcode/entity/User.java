package com.geetcode.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.annotation.Generated;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;

@Getter  //Generates the setters and getters for all these entities when it compiles
@Setter 

@Entity // Tells spring/hibernate that Create a table in postgres for this class

@Table(name="users") // renames the table name in sql to users- as user is a preserved keyword in sql



public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //primary key of the sql table

    @Column(nullable = false)
    private String name;

    @Column(nullable = false,unique=true)
    private String email;

    @JsonIgnore  //tells spring , Whenever you convert a User object into JSON to send to the frontend, 
    // skip the password field.
    @Column(nullable = false)
    private String password;

    @Column(nullable=false)
    private String role ="USER";


    
}
