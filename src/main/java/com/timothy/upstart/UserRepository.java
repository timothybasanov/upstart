package com.timothy.upstart;

import org.springframework.data.repository.CrudRepository;

/**
 * Implemented user auto-wire.
 */
public interface UserRepository extends CrudRepository<User, Integer> {

}
