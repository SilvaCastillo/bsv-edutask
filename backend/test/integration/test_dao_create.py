import pytest
import unittest.mock as mock
from pymongo.errors import WriteError
from src.util.dao import DAO



@pytest.fixture
def test_dao():
    collection = "task"
    dao = DAO(collection)
    dao.collection.delete_many({})
    yield dao
    dao.collection.drop()

@pytest.mark.integration
def test_create_task_valid_data(test_dao):
    valid_data = {
        "title": "Valid title",
        "description": "Valid description",
    }
    result = test_dao.create(valid_data)

    assert result["title"] == valid_data["title"]
    assert "description" in result
    assert "_id" in result

@pytest.mark.integration
def test_create_task_missing_required_data(test_dao):
    invalid_data = {
        "description": "Missing title"
    }
    with pytest.raises(WriteError):
        test_dao.create(invalid_data)


@pytest.mark.integration
def test_create_task_wrong_type_data(test_dao):
    wrong_type_data = {
        "title": "Wrong type description",
        "description": 123
    }
    with pytest.raises(WriteError):
        test_dao.create(wrong_type_data)

