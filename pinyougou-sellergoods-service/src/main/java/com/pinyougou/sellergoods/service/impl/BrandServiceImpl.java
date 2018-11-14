package com.pinyougou.sellergoods.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.pojo.TbBrandExample;
import com.pinyougou.pojo.TbBrandExample.Criteria;
import com.pinyougou.sellergoods.service.BrandService;

import entity.PageResult;
@Service
public class BrandServiceImpl implements BrandService{
	@Autowired
	private TbBrandMapper tbBrandMapper;
	@Override
	public List<TbBrand> findAll() {
		// TODO Auto-generated method stub
		return tbBrandMapper.selectByExample(null);
	}
	
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		// TODO Auto-generated method stub
		PageHelper.startPage(pageNum,pageSize);//分页
		Page<TbBrand> page=(Page<TbBrand>)tbBrandMapper.selectByExample(null);
		PageResult pageResult=new PageResult(page.getTotal(),page.getResult() );
		return pageResult;
	}
	
	@Override
	public void add(TbBrand tbBrand) {
		// TODO Auto-generated method stub
		tbBrandMapper.insert(tbBrand);
	}
	
	@Override
	public TbBrand findOne(Long id) {
		// TODO Auto-generated method stub
		return tbBrandMapper.selectByPrimaryKey(id);
	}
	
	
	@Override
	public void update(TbBrand tbBrand) {
		// TODO Auto-generated method stub
		tbBrandMapper.updateByPrimaryKey(tbBrand);
	}
	
	@Override
	public void delete(Long[] ids) {
		// TODO Auto-generated method stub
		for(Long id:ids) {
			tbBrandMapper.deleteByPrimaryKey(id);
		}
	}
	
	@Override
	public PageResult findPage(TbBrand tbBrand, int pageNum, int pageSize) {
		// TODO Auto-generated method stub
		PageHelper.startPage(pageNum,pageSize);//分页
		TbBrandExample example=new TbBrandExample();
		Criteria criteria=example.createCriteria();
		if (tbBrand!=null) {
			if (tbBrand.getName()!=null && tbBrand.getName().length()>0) {
				criteria.andNameLike("%"+tbBrand.getName()+"%");
			}
			if (tbBrand.getFirstChar()!=null && tbBrand.getFirstChar().length()>0) {
				criteria.andFirstCharLike("%"+tbBrand.getFirstChar()+"%");
		}
		}
		Page<TbBrand> page=(Page<TbBrand>)tbBrandMapper.selectByExample(example);
		PageResult pageResult=new PageResult(page.getTotal(),page.getResult() );
		return pageResult;
	}

	/**
	 * 品牌下拉数据
	 */
	@Override
	public List<Map> selectOptionList() {
		//tbBrandMapper.sele
		
		return tbBrandMapper.selectOptionList();
	}
}
