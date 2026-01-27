import { createInquiryAsAdmin, createInquiryAsUser, findInquiryById, findInquiryByUserId, findInquiryDetail } from "../repositories/inquiry.repository.js";
import { findUserById } from "../repositories/user.repository.js";
import { InvalidUserError } from "../errors/user.error.js";
import { InquiryAlreadyExistsError, InquiryBadRequestError, InquiryInternalError, InquiryNotFoundError } from "../errors/inquiry.error.js";
import { BadRequestError, NotFoundError } from "../errors/base.error.js";

export const insertInquiryAsUser = async (userId, title, content) => {
  const user = await findUserById(userId);
  if (!user) throw new InvalidUserError(undefined, undefined, userId);
  try {
    const result = await createInquiryAsUser(userId, title, content);
    return result;
  } catch (error) {
    if (error instanceof NotFoundError ||
      error instanceof BadRequestError
    ) { throw error; }
    switch (error.code) {
      case "P2002":
        throw new InquiryAlreadyExistsError();

      case "P2003":
        throw new InvalidUserError();

      case "P2025":
        throw new InquiryBadRequestError();

      default:
        throw new InquiryInternalError();
    }
  }
}

export const insertInquiryAsAdmin = async (inquiryId, answerContent) => {
  try {
    const result = await createInquiryAsAdmin(inquiryId, answerContent);
    return result;
  } catch (error) {
    if (error instanceof NotFoundError ||
      error instanceof BadRequestError
    ) { throw error; }
    switch (error.code) {
      case "P2002":
        throw new InquiryAlreadyExistsError();

      case "P2003":
        throw new InvalidUserError();

      case "P2025":
        throw new InquiryBadRequestError();

      default:
        throw new InquiryInternalError();
    }
  }
}

export const selectInquiry = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw new InvalidUserError();
  try {
    const result = await findInquiryByUserId(userId);
    if (result == null) throw new InquiryBadRequestError();
    return result;
  } catch (error) {
    if (error instanceof NotFoundError ||
      error instanceof BadRequestError
    ) { throw error; }
    switch (error.code) {
      case "P2002":
        throw new InquiryAlreadyExistsError();

      case "P2003":
        throw new InvalidUserError();

      case "P2025":
        throw new InquiryBadRequestError();

      default:
        throw new InquiryInternalError();
    }
  }
}

export const selectInquiryDetail = async (userId, inquiryId) => {
  const inquiry = await findInquiryById(inquiryId);
  if (inquiry == null) throw new InquiryNotFoundError(undefined, undefined, inquiryId);
  try {
    const result = await findInquiryDetail(userId, inquiryId);
    if (result == null) throw new InquiryBadRequestError();
    return result;
  } catch (error) {
    if (error instanceof NotFoundError ||
      error instanceof BadRequestError
    ) { throw error; }
    switch (error.code) {
      case "P2002":
        throw new InquiryAlreadyExistsError();

      case "P2003":
        throw new InvalidUserError();

      case "P2025":
        throw new InquiryBadRequestError();

      default:
        throw new InquiryInternalError();
    }
  }
}