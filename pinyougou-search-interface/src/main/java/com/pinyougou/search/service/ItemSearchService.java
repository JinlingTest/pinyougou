package com.pinyougou.search.service;

import java.util.Map;

public interface ItemSearchService {

	/***
	 * 搜索
	 * @param SearchMap
	 * @return
	 */
	public Map<String,Object> search(Map SearchMap);
}
