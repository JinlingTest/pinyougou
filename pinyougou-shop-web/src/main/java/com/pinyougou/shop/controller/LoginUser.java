package com.pinyougou.shop.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public final class LoginUser {
	
	@RequestMapping("/getUsername")
	public String getUsername() {
		
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		
		return username;
	}

}
