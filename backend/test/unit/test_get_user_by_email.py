import pytest
import unittest.mock as mock

from src.controllers.usercontroller import UserController

@pytest.fixture
def sut():
    mocked_usercontroller = mock.MagicMock()
    mocked_sut = UserController(dao=mocked_usercontroller)
    return mocked_sut

@pytest.mark.unit
@pytest.mark.parametrize(
    "users, expected",
        [
            ([{"email": "johndoe@example.com"}], {"email": "johndoe@example.com"}), # one user
            ([{"email": "johndoe@example.com"}, {"email": "johndoe@example.com"}], {"email": "johndoe@example.com"}), # multiple users
            ([], None), # no user
        ]
)
def test_get_user_by_email_returns_expected_for_one_multiple_and_no_user(sut, users, expected):
    sut.dao.find.return_value = users

    result = sut.get_user_by_email("johndoe@example.com")

    assert result == expected

@pytest.mark.unit
def test_get_user_by_email_raises_valueerror_if_invalid_email(sut):
    with pytest.raises(ValueError) as error:
        sut.get_user_by_email("invalidEmail")  # use an invalid email

    assert "Error: invalid email address" in str(error.value)

@pytest.mark.unit
def test_get_user_by_email_raises_exception_if_database_failure(sut):
    sut.dao.find.side_effect = Exception("Database error")

    with pytest.raises(Exception) as error:
        sut.get_user_by_email("johndoe@example.com")

    assert "Database error" in str(error.value)
