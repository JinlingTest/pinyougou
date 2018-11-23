package com.pinyougou.search.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.Criteria;
import org.springframework.data.solr.core.query.GroupOptions;
import org.springframework.data.solr.core.query.HighlightOptions;
import org.springframework.data.solr.core.query.HighlightQuery;
import org.springframework.data.solr.core.query.Query;
import org.springframework.data.solr.core.query.SimpleHighlightQuery;
import org.springframework.data.solr.core.query.SimpleQuery;
import org.springframework.data.solr.core.query.result.GroupEntry;
import org.springframework.data.solr.core.query.result.GroupPage;
import org.springframework.data.solr.core.query.result.GroupResult;
import org.springframework.data.solr.core.query.result.HighlightEntry;
import org.springframework.data.solr.core.query.result.HighlightPage;
import org.springframework.data.solr.core.query.result.ScoredPage;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
@Service(timeout=5000)
public class ItemSearchServiceImpl implements ItemSearchService {

	@Autowired
	private SolrTemplate solrTemplate;
	
	@Autowired
	private RedisTemplate redisTemplate;
	
	/***
	 * 根据商品的分类名称去Redis中查询模板表中的数据
	 * 模板表中的选项集合
	 * 品牌集合
	 * @param category
	 * @return
	 */
	private Map searchBrandAndSpecList(String category){
		Map map = new HashMap();
		//根据分类的名称获取模板的id
		Long typeId =  (Long) redisTemplate.boundHashOps("itemCat").get(category);
		
		if(typeId != null) {
			//根据模板id获取到brandsIds  品牌的模板
			List brandList = (List)redisTemplate.boundHashOps("brandList").get(typeId);
			map.put("brandList", brandList);
			System.out.println("ItemSearchServiceImpl>>>>> " +brandList);
			
			//根据模板的Id获取到SpecIds  选项规格的模板
			List specList  = (List)redisTemplate.boundHashOps("specList").get(typeId);
			System.out.println("ItemSearchServiceImpl>>>>> " +specList);
			map.put("specList", specList);
			
		}
		System.out.println(map);
		return map;
	}
	
	
	
	/***
	 * 根据关键字搜索列表
	 */
	public Map<String, Object> search(Map searchMap){
		
		Map<String, Object> map = new HashMap<>();
		//1.an关键字查询
		map.putAll(searchList(searchMap));
		
		//2.根据关键字查询商品分类
		List<String> categoryList = searchCategoryList(searchMap);
		System.out.println("根据关键字查询到的商品分类名称" + categoryList);
		map.put("categoryList", categoryList);
		
		
		//根据分类的名称查询到
		if(categoryList.size() > 0) {
			System.out.println("1："+ categoryList.get(0));
			Map options = searchBrandAndSpecList(categoryList.get(0));
			System.out.println("2"+options);
			map.putAll(options);
		}
		System.out.println("ItemSearchServiceImpl>>> : "+map);
		return map;
	}
	
	public Map searchList(Map searchMap) {
		Map map=new HashMap();
		
		//SimpleQuery query = new SimpleQuery();
		HighlightQuery query = new SimpleHighlightQuery();
		HighlightOptions highlightOptions = new HighlightOptions().addField("item_title");   //设置高亮域

		highlightOptions.setSimplePrefix("<em style='color:red'>");//高亮前缀
		highlightOptions.setSimplePostfix("</em>");//高亮后缀
		query.setHighlightOptions(highlightOptions);    //设置高亮选项
		
		//按照关键字查询
		Criteria criteria=new Criteria("item_keywords").is(searchMap.get("keywords"));
		query.addCriteria(criteria);
		HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query, TbItem.class);
		System.out.println("[page]>>" + page.toString());
		
		//ScoredPage<TbItem> page = solrTemplate.queryForPage(query, TbItem.class);
		List<HighlightEntry<TbItem>> highlighted = page.getHighlighted();
		System.out.println("入口集合:" + highlighted.toString());
		
		//循环入口集合
		for (HighlightEntry<TbItem> h : highlighted) {
			//获取原实体类
			TbItem item = h.getEntity();
			System.out.println("实体类:" + item);
			if(h.getHighlights() != null && h.getHighlights().size() > 0) {
				item.setTitle(h.getHighlights().get(0).getSnipplets().get(0));
			}
		}
		
		map.put("rows", page.getContent());
		
		System.out.println(map);
		return map;
	}
	
	/***
	 * 查询分类列表 
	 * @param searchMap
	 * @return
	 */
	private List searchCategoryList(Map searchMap) {
			
			List<String> list = new ArrayList<>();
			Query query = new SimpleQuery();
			//按照关键字查询
			Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
			query.addCriteria(criteria);
			//设置分组选项
			GroupOptions groupOptions = new GroupOptions().addGroupByField("item_category");
			query.setGroupOptions(groupOptions);
			
			//得到分组页
			GroupPage<TbItem> page = solrTemplate.queryForGroupPage(query, TbItem.class);
			//根据列得到分组结果集
			GroupResult<TbItem> groupResult = page.getGroupResult("item_category");
			//得到分组结果入口页
			Page<GroupEntry<TbItem>> groupEntries = groupResult.getGroupEntries();
			//得到分组入口集合
			List<GroupEntry<TbItem>> content = groupEntries.getContent();
			
			for(GroupEntry<TbItem> entry:content){
				list.add(entry.getGroupValue());//将分组结果的名称封装到返回值中
			}								
		return list;
	}
}
