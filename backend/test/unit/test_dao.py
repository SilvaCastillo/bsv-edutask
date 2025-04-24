import pytest
import unittest.mock as mock
from pymongo.errors import WriteError
from src.util.dao import DAO



@pytest.fixture
def test_dao():
    collection = "todo"
    dao = DAO(collection)
    dao.collection.delete_many({})

    yield dao

    dao.collection.delete_many({})


def test_create_valid_data(test_dao):
    task = {
        "title": "Test code",
        "description": "Test the assigned code for the course",
    }
    result = test_dao.create(task)

    assert result["title"] == task["title"]
    assert "description" in result
    assert "_id" in result

def test_create_missing_required_description(test_dao):
    invalid_data = {
        "title": "Check course",
    }

    with pytest.raises(WriteError):
        test_dao.create(invalid_data)
