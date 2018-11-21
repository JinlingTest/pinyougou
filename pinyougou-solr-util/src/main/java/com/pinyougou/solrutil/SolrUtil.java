package com.pinyougou.solrutil;

import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Component;

import com.pinyougou.mapper.TbItemMapper;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.pojo.TbItemExample;
import com.pinyougou.pojo.TbItemExample.Criteria;

@Component
public class SolrUtil {
	
	@Autowired
	private TbItemMapper itemMapper;
	
	/***
	 * 导入商品数据
	 */
	public void importItemData() {
		
		TbItemExample example = new TbItemExample();
		Criteria criteria = example.createCriteria();
		criteria.andStatusEqualTo("1");   //只查询状态为1的SKU
		List<TbItem> itemList = itemMapper.selectByExample(example);

		System.out.println("===商品列表====");
		
		for (TbItem tbItem : itemList) {
			System.out.println(tbItem.getTitle());
		}
		System.out.println("=====结束====");
		
	}
	
	public static void main(String[] args) {
		ApplicationContext context=new
				ClassPathXmlApplicationContext("classpath*:spring/applicationContext*.xml");
				SolrUtil solrUtil= (SolrUtil) context.getBean("solrUtil");
				solrUtil.importItemData();
	}

}
